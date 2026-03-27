import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreEntry {
    user: Principal;
    highScore: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerScore(): Promise<bigint>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(limit: bigint): Promise<Array<ScoreEntry>>;
    getScore(user: Principal): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveScore(score: bigint): Promise<void>;
}
