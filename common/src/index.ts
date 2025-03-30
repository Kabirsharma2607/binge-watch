import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(16),
  })
  .strict();

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6).max(16),
  })
  .strict();

export type LoginSchema = z.infer<typeof loginSchema>;

export const createRoomSchema = z
  .object({
    name: z.string(),
    capacity: z.number(),
  })
  .strict();

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;

export enum WebSocketActions {
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  TEXT_MESSAGE = "TEXT_MESSAGE",
  ACTIONS = "ACTIONS",
}

export const joinRoomSchema = z.object({
  type: z.enum([WebSocketActions.JOIN_ROOM]),
  data: z.object({
    roomId: z.string(),
    username: z.string(),
  }),
});

export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;

// TODO: A standard type, data schema
// export const websocketMessageSchema = z.object({
//   type: z.enum([
//     WebSocketActions.JOIN_ROOM,
//     WebSocketActions.LEAVE_ROOM,
//     WebSocketActions.TEXT_MESSAGE,
//     WebSocketActions.ACTIONS,
//   ]),
//   data: z.union([
//     z.object({
//       roomId: z.string(),
//       username: z.string(),
//     }),
//     z.object({
//       username: z.string(),
//     }),
//   ]),
// });

export const leaveRoomSchema = z.object({
  type: z.enum([WebSocketActions.LEAVE_ROOM]),
  data: z.object({
    roomId: z.string(),
    username: z.string(),
  }),
});

export type LeaveRoomSchema = z.infer<typeof leaveRoomSchema>;

export const textMessageSchema = z.object({
  type: z.enum([WebSocketActions.TEXT_MESSAGE]),
  data: z.object({
    roomId: z.string(),
    username: z.string(),
    message: z.string(),
  }),
});

export type TextMessageSchema = z.infer<typeof textMessageSchema>;

export enum VideoActions {
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  SEEK = "SEEK",
}

export const actionsSchema = z.object({
  type: z.enum([WebSocketActions.ACTIONS]),
  data: z.object({
    roomId: z.string(),
    username: z.string(),
    action: z.enum([VideoActions.PLAY, VideoActions.SEEK, VideoActions.PAUSE]),
  }),
});

export type ActionsSchema = z.infer<typeof actionsSchema>;
