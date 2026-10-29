export interface PublicAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
}

/** The only admin fields that may ever be sent to a browser. */
export function toPublicAdmin(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
}): PublicAdmin {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}