import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import UserProfileManager from "../../../../app/libraries/user/user-profile-manager";
import UserSettingAction from "../../../../app/actions/user/user-setting-action";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * ユーザー設定を行うアクション。
 */
let userSettingAction: UserSettingAction;

