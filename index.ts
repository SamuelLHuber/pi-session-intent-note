import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const INTENT_KEY = "session-intent";
const MAX_STATUS_LEN = 15;

function truncateIntent(text: string): string {
	if (text.length <= MAX_STATUS_LEN) return text;
	return text.slice(0, MAX_STATUS_LEN) + "…";
}

export default function (pi: ExtensionAPI) {
	let currentIntent = "";

	function updateStatus(ctx: { ui: { setStatus: (key: string, text: string | undefined) => void; theme: { fg: (color: string, text: string) => string } } }) {
		if (currentIntent) {
			const truncated = truncateIntent(currentIntent);
			ctx.ui.setStatus(INTENT_KEY, ctx.ui.theme.fg("accent", `Intent: ${truncated}`));
		} else {
			ctx.ui.setStatus(INTENT_KEY, undefined);
		}
	}

	pi.on("session_start", async (_event, ctx) => {
		const entries = ctx.sessionManager.getEntries();
		for (let i = entries.length - 1; i >= 0; i--) {
			const entry = entries[i];
			if (entry.type === "custom" && entry.customType === INTENT_KEY) {
				currentIntent = (entry.data as { text?: string }).text ?? "";
				break;
			}
		}
		updateStatus(ctx);
	});

	pi.registerCommand("intent", {
		description: "Set or edit the session intent",
		handler: async (args, ctx) => {
			if (args.trim()) {
				currentIntent = args.trim();
				pi.appendEntry(INTENT_KEY, { text: currentIntent });
				updateStatus(ctx);
				ctx.ui.notify("Intent set", "info");
				return;
			}

			const newIntent = await ctx.ui.input(
				"Session intent",
				currentIntent || "e.g. Refactor auth module",
			);

			if (newIntent !== undefined) {
				currentIntent = newIntent.trim();
				pi.appendEntry(INTENT_KEY, { text: currentIntent });
				updateStatus(ctx);
				ctx.ui.notify(currentIntent ? "Intent updated" : "Intent cleared", "info");
			}
		},
	});

	pi.registerShortcut("ctrl+g", {
		description: "Edit session intent",
		handler: async (ctx) => {
			const newIntent = await ctx.ui.input(
				"Session intent",
				currentIntent || "e.g. Refactor auth module",
			);
			if (newIntent !== undefined) {
				currentIntent = newIntent.trim();
				pi.appendEntry(INTENT_KEY, { text: currentIntent });
				updateStatus(ctx);
				ctx.ui.notify(currentIntent ? "Intent updated" : "Intent cleared", "info");
			}
		},
	});
}
