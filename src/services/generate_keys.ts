import crypto from "crypto";

const key = crypto.randomBytes(32).toString("hex");

export default key;