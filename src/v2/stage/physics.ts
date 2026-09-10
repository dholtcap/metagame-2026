// Tiny 2D rigid-square physics, pure math — no DOM, no React. Everything is in
// document pixels (x right, y down) so a body's coordinates are exactly what
// the overlay sprite needs for `translate()`.
//
// Bodies are Verlet particle squares: four corner particles pinned to a square
// by six distance constraints (edges + diagonals). That gives tumbling and
// flat settling for free, and position-based collision can't explode the way
// impulse solvers do when the page's layout jumps under the body.
//
// Colliders are axis-aligned rects (what DOM layout hands us). Bodies collide
// with rects, not with each other.

export type Rect = { x: number; y: number; w: number; h: number };

export type SquareBody = {
  size: number;
  // Corner positions, clockwise from the top-left in the body's rest pose.
  p: Float64Array; // [x0,y0, x1,y1, x2,y2, x3,y3]
  q: Float64Array; // previous positions (Verlet velocity is p - q)
  asleep: boolean;
  stillFrames: number;
};

export type Material = {
  gravity: number; // px/s²
  restitution: number; // 0..1, bounciness on rect contact
  friction: number; // 0..1, tangential velocity kept fraction is (1 - friction)
  damping: number; // per-substep linear drag, 0..1
  substeps: number;
  iterations: number; // constraint/collision passes per substep
};

export const DEFAULT_MATERIAL: Material = {
  gravity: 2400,
  restitution: 0.3,
  friction: 0.25,
  damping: 0.002,
  substeps: 4,
  iterations: 3,
};

// Below this per-frame movement (px) for SLEEP_FRAMES frames the body sleeps.
const SLEEP_SPEED = 0.06;
const SLEEP_FRAMES = 40;

export function createSquare(cx: number, cy: number, size: number): SquareBody {
  const h = size / 2;
  const p = new Float64Array([
    cx - h,
    cy - h,
    cx + h,
    cy - h,
    cx + h,
    cy + h,
    cx - h,
    cy + h,
  ]);
  return { size, p, q: new Float64Array(p), asleep: true, stillFrames: 0 };
}

export function centerOf(b: SquareBody): { x: number; y: number } {
  const { p } = b;
  return {
    x: (p[0] + p[2] + p[4] + p[6]) / 4,
    y: (p[1] + p[3] + p[5] + p[7]) / 4,
  };
}

// Rotation of the top edge (P0→P1), radians.
export function angleOf(b: SquareBody): number {
  return Math.atan2(b.p[3] - b.p[1], b.p[2] - b.p[0]);
}

export function wake(b: SquareBody) {
  b.asleep = false;
  b.stillFrames = 0;
}

// Add velocity (px/s) to every particle — a kick.
export function impulse(b: SquareBody, vx: number, vy: number, dt = 1 / 60) {
  for (let i = 0; i < 4; i++) {
    b.q[i * 2] -= vx * dt;
    b.q[i * 2 + 1] -= vy * dt;
  }
  wake(b);
}

// Teleport, keeping the body at rest.
export function place(b: SquareBody, cx: number, cy: number) {
  const fresh = createSquare(cx, cy, b.size);
  b.p.set(fresh.p);
  b.q.set(fresh.p);
  b.asleep = true;
  b.stillFrames = 0;
}

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];
const DIAGONALS: [number, number][] = [
  [0, 2],
  [1, 3],
];

function satisfyConstraints(b: SquareBody) {
  const { p, size } = b;
  const diag = size * Math.SQRT2;
  const relax = (i: number, j: number, rest: number) => {
    const dx = p[j * 2] - p[i * 2];
    const dy = p[j * 2 + 1] - p[i * 2 + 1];
    const d = Math.hypot(dx, dy) || 1e-6;
    const k = ((d - rest) / d) * 0.5;
    p[i * 2] += dx * k;
    p[i * 2 + 1] += dy * k;
    p[j * 2] -= dx * k;
    p[j * 2 + 1] -= dy * k;
  };
  for (const [i, j] of EDGES) relax(i, j, size);
  for (const [i, j] of DIAGONALS) relax(i, j, diag);
}

// After moving particle i out along unit normal (nx,ny), rewrite its Verlet
// velocity: bounce the normal component, damp the tangential one.
function respond(
  b: SquareBody,
  i: number,
  nx: number,
  ny: number,
  m: Material,
) {
  const { p, q } = b;
  const vx = p[i * 2] - q[i * 2];
  const vy = p[i * 2 + 1] - q[i * 2 + 1];
  const vn = vx * nx + vy * ny;
  const tx = vx - vn * nx;
  const ty = vy - vn * ny;
  // Only bounce when moving into the surface (vn < 0 after push-out means the
  // pre-correction motion was inward).
  const bn = vn < 0 ? -vn * m.restitution : vn;
  const keep = 1 - m.friction;
  q[i * 2] = p[i * 2] - (tx * keep + bn * nx);
  q[i * 2 + 1] = p[i * 2 + 1] - (ty * keep + bn * ny);
}

// Corner-of-body inside rect: push out along the shallowest side.
function collideCornerRect(b: SquareBody, r: Rect, m: Material) {
  const { p } = b;
  for (let i = 0; i < 4; i++) {
    const x = p[i * 2];
    const y = p[i * 2 + 1];
    if (x <= r.x || x >= r.x + r.w || y <= r.y || y >= r.y + r.h) continue;
    const dl = x - r.x;
    const dr = r.x + r.w - x;
    const dt = y - r.y;
    const db = r.y + r.h - y;
    const min = Math.min(dl, dr, dt, db);
    if (min === dt) {
      p[i * 2 + 1] = r.y;
      respond(b, i, 0, -1, m);
    } else if (min === db) {
      p[i * 2 + 1] = r.y + r.h;
      respond(b, i, 0, 1, m);
    } else if (min === dl) {
      p[i * 2] = r.x;
      respond(b, i, -1, 0, m);
    } else {
      p[i * 2] = r.x + r.w;
      respond(b, i, 1, 0, m);
    }
  }
}

// Corner-of-rect inside body: a narrow element (a button edge, a text line
// end) poking into the square between two of its corners. Push the nearest
// body edge out past the rect corner.
function collideRectCornerBody(b: SquareBody, r: Rect, m: Material) {
  const { p } = b;
  const corners = [
    [r.x, r.y],
    [r.x + r.w, r.y],
    [r.x + r.w, r.y + r.h],
    [r.x, r.y + r.h],
  ];
  for (const [cx, cy] of corners) {
    // Inside test against the convex quad: same sign of cross on every edge.
    let inside = true;
    let bestDepth = Infinity;
    let bestEdge = -1;
    let bestT = 0;
    let bestNx = 0;
    let bestNy = 0;
    for (let e = 0; e < 4 && inside; e++) {
      const [i, j] = EDGES[e];
      const ax = p[i * 2];
      const ay = p[i * 2 + 1];
      const ex = p[j * 2] - ax;
      const ey = p[j * 2 + 1] - ay;
      const cross = ex * (cy - ay) - ey * (cx - ax);
      // Corners run clockwise in screen space (y down), so inside is cross > 0.
      if (cross <= 0) {
        inside = false;
        break;
      }
      const len = Math.hypot(ex, ey) || 1e-6;
      const depth = cross / len;
      if (depth < bestDepth) {
        bestDepth = depth;
        bestEdge = e;
        bestT = Math.max(
          0,
          Math.min(1, ((cx - ax) * ex + (cy - ay) * ey) / (len * len)),
        );
        // Outward normal of a clockwise edge (y down): (ey, -ex) / len.
        bestNx = ey / len;
        bestNy = -ex / len;
      }
    }
    if (!inside || bestEdge < 0) continue;
    const [i, j] = EDGES[bestEdge];
    const w0 = 1 - bestT;
    const w1 = bestT;
    const norm = w0 * w0 + w1 * w1 || 1;
    const pad = bestDepth + 0.01;
    p[i * 2] += bestNx * pad * (w0 / norm);
    p[i * 2 + 1] += bestNy * pad * (w0 / norm);
    p[j * 2] += bestNx * pad * (w1 / norm);
    p[j * 2 + 1] += bestNy * pad * (w1 / norm);
    respond(b, i, bestNx, bestNy, m);
    respond(b, j, bestNx, bestNy, m);
  }
}

// Keep every particle inside the stage bounds.
function collideBounds(b: SquareBody, bounds: Rect, m: Material) {
  const { p } = b;
  for (let i = 0; i < 4; i++) {
    const x = p[i * 2];
    const y = p[i * 2 + 1];
    if (x < bounds.x) {
      p[i * 2] = bounds.x;
      respond(b, i, 1, 0, m);
    } else if (x > bounds.x + bounds.w) {
      p[i * 2] = bounds.x + bounds.w;
      respond(b, i, -1, 0, m);
    }
    if (y > bounds.y + bounds.h) {
      p[i * 2 + 1] = bounds.y + bounds.h;
      respond(b, i, 0, -1, m);
    } else if (y < bounds.y) {
      p[i * 2 + 1] = bounds.y;
      respond(b, i, 0, 1, m);
    }
  }
}

// Broad-phase: only rects near the body are worth testing.
function near(b: SquareBody, r: Rect): boolean {
  const { p } = b;
  const pad = b.size;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let i = 0; i < 4; i++) {
    minX = Math.min(minX, p[i * 2]);
    maxX = Math.max(maxX, p[i * 2]);
    minY = Math.min(minY, p[i * 2 + 1]);
    maxY = Math.max(maxY, p[i * 2 + 1]);
  }
  return !(
    maxX + pad < r.x ||
    minX - pad > r.x + r.w ||
    maxY + pad < r.y ||
    minY - pad > r.y + r.h
  );
}

// Advance one frame. `ax`/`ay` is extra acceleration on top of gravity (px/s²)
// — the scroll pseudo-force, a gust, whatever. Returns true if the body moved.
export function step(
  b: SquareBody,
  dt: number,
  ax: number,
  ay: number,
  rects: readonly Rect[],
  bounds: Rect,
  m: Material = DEFAULT_MATERIAL,
): boolean {
  if (b.asleep) return false;
  const { p, q } = b;
  const h = dt / m.substeps;
  const gy = ay + m.gravity;
  const candidates = rects.filter((r) => near(b, r));
  const before = new Float64Array(p);

  for (let s = 0; s < m.substeps; s++) {
    for (let i = 0; i < 4; i++) {
      const x = p[i * 2];
      const y = p[i * 2 + 1];
      p[i * 2] = x + (x - q[i * 2]) * (1 - m.damping) + ax * h * h;
      p[i * 2 + 1] = y + (y - q[i * 2 + 1]) * (1 - m.damping) + gy * h * h;
      q[i * 2] = x;
      q[i * 2 + 1] = y;
    }
    for (let k = 0; k < m.iterations; k++) {
      satisfyConstraints(b);
      for (const r of candidates) {
        collideCornerRect(b, r, m);
        collideRectCornerBody(b, r, m);
      }
      collideBounds(b, bounds, m);
    }
  }

  let maxMove = 0;
  for (let i = 0; i < 8; i++) {
    maxMove = Math.max(maxMove, Math.abs(p[i] - before[i]));
  }
  if (maxMove < SLEEP_SPEED) {
    if (++b.stillFrames >= SLEEP_FRAMES) {
      b.asleep = true;
      b.q.set(b.p);
    }
  } else {
    b.stillFrames = 0;
  }
  return true;
}
