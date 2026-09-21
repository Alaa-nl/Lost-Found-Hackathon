import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { StatusBadge } from "./StatusBadge";

const documentedProps = ["status"] as const;

const meta = {
  title: "Atoms/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: [...documentedProps],
    },
  },
  args: {
    status: "waiting",
  },
  argTypes: {
    className: { table: { disable: true } },
    status: {
      control: "radio",
      options: ["waiting", "claimed"],
    },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Waiting")).toBeVisible();
  },
};
