import { addListener } from "@/lib/content-stream";

/**
 * SSE endpoint — browsers connect here to receive live content change notifications.
 * When /api/revalidate fires, this stream pushes a message to all connected clients.
 */
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keepalive
      controller.enqueue(encoder.encode(": connected\n\n"));

      const remove = addListener((paths) => {
        const data = JSON.stringify({ paths, timestamp: Date.now() });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      });

      // Keepalive every 30s to prevent timeout
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepalive);
        }
      }, 30_000);

      // Cleanup when client disconnects
      const check = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(""));
        } catch {
          remove();
          clearInterval(keepalive);
          clearInterval(check);
        }
      }, 5_000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
