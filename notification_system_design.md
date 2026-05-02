# Stage 1

## Notification System Architectural Approach

The Priority Inbox requires rendering the top `n` notifications based on a strictly evaluated weight hierarchy (`Placement` > `Result` > `Event`) combined with temporal recency (`Timestamp`).

### Priority Resolution Strategy

To handle incoming data streams effectively, the architecture separates standard fetching from priority processing.

1. **Weight Mapping:** A predefined dictionary maps categorical string values to strict integer weights (Placement: 3, Result: 2, Event: 1).
2. **Sorting Logic:** The primary heuristic evaluates the integer difference between the categorical weights of two notifications. In the event of a weight collision (e.g., two `Placement` notifications), a secondary heuristic computes the differential between their parsed timestamps to enforce strict chronological precedence.

### Algorithmic Efficiency for Streaming Data

While the provided implementation utilizes standard array traversal and `Array.prototype.sort()` to reliably generate the subset array of size `n` for static validation sets, standard sorting approaches O(N log N) computational complexity.

For high-volume production streams where continuous micro-batches of notifications arrive, maintaining the top 10 efficiently is accomplished using a **Min-Heap (Priority Queue)** data structure strictly capped at size `n`.

- As new notifications arrive, they are evaluated against the root of the Min-Heap O(1).
- If the incoming notification possesses a higher combined weight-temporal score than the heap's root, the root is discarded and the new notification is inserted O(log n).
- This reduces the continuous maintenance complexity of a massive stream of N objects to O(N log n), ensuring the backend memory footprint remains minimal and responsive.
