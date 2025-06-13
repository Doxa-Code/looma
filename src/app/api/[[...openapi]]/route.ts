"use server";
import { talkToLoomaAction } from "@/app/actions";
import {
  createOpenApiServerActionRouter,
  createRouteHandlers,
} from "zsa-openapi";

const router = createOpenApiServerActionRouter({
  pathPrefix: "/api",
}).post("/talk-to-looma", talkToLoomaAction);

export const { POST } = createRouteHandlers(router);
