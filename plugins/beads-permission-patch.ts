import type { Plugin } from "@opencode-ai/plugin";

/**
 * Local plugin that patches beads-task-agent permissions after the
 * opencode-beads plugin runs its config hook.
 *
 * The beads plugin does a shallow spread: config.agent = { ...config.agent, ...agents }
 * which discards any "permission" field set in opencode.json.
 * This plugin runs AFTER beads and deep-merges the permission back in.
 */
export const BeadsPermissionPatch: Plugin = async () => {
  return {
    config: async (config) => {
      if (config.agent?.["beads-task-agent"]) {
        config.agent["beads-task-agent"].permission = {
          ...(config.agent["beads-task-agent"].permission ?? {}),
          bash: {
            ...((config.agent["beads-task-agent"].permission as any)?.bash ?? {}),
            "bd *": "allow",
          },
        };
      }
    },
  };
};