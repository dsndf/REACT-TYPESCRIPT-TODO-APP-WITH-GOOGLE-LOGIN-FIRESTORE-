export const getEnv = (envName: string) => import.meta.env["VITE_" + envName];
