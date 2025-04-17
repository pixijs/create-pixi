/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The top-level namespace for the YouTube Playables SDK.
 */
declare namespace ytgame {
  /**
   * The types of errors that the YouTube Playables SDK throws.
   */
  export const enum SdkErrorType {
    /**
     * The error type is unknown.
     */
    UNKNOWN,
    /**
     * The API was temporarily unavailable. Ask players to retry at a later time
     * if they are in a critical flow.
     */
    API_UNAVAILABLE,
    /**
     * The API was called with invalid parameters.
     */
    INVALID_PARAMS,
    /**
     * The API was called with parameters exceeding the size limit.
     */
    SIZE_LIMIT_EXCEEDED,
  }

  /**
   * The error object that the YouTube Playables SDK throws. The `SdkError`
   * object is a child of `Error` and contains an additional field.
   */
  export class SdkError extends Error {
    /**
     * The type of the error.
     */
    errorType: SdkErrorType;
  }

  /**
   * The YouTube Playables SDK version.
   */
  export const SDK_VERSION: string;

  /**
   * Whether or not the game is running within the Playables environment.
   */
  export const IN_PLAYABLES_ENV: boolean;
}

/**
 * The functions and properties related to advertisements.
 */

declare namespace ytgame.ads {
  /**
   * The possible outcomes of a successful ad break.
   */
  export const enum AdResult {
    UNKNOWN,
    SHOWED,
    DISMISSED,
    REJECTED,
  }

  /**
   * Requests an ad to be shown.
   *
   * @throws {ytgame.SdkError} Will throw an error if the ad fails to load.
   */
  export function requestAd(): Promise<AdResult>;
}

/**
 * The functions and properties related to player engagement.
 */
declare namespace ytgame.engagement {
  /**
   * The score object the game sends to YouTube.
   */
  export interface Score {
    /**
     * The score value expressed as an integer.
     */
    value: number;
  }

  /**
   * Sends a score to YouTube.
   *
   * @return a Promise that completes when succeeded and rejects with an
   * `SdkError` when failed.
   */
  export function sendScore(score: Score): Promise<void>;

  /**
   * The content object the game sends to YouTube.
   */
  export interface Content {
    /**
     * The ID of the video we want to open.
     */
    id: string;
  }

  /**
   * Requests YouTube to open content corresponding to the provided video ID.
   * Throws invalid params error if the video ID is invalid.
   */
  export function openYTContent(content: Content): Promise<void>;
}

/**
 * The functions and properties related to generic game behaviors.
 */
declare namespace ytgame.game {
  /**
   * Notifies YouTube that the game's first frame is ready to be
   * shown. The game **MUST** call this API. Otherwise, the game is not shown to
   * users. `firstFrameReady()` **MUST** be called before `gameReady()`.
   */
  export function firstFrameReady(): void;

  /**
   * Notifies YouTube that the game is ready for players to interact with. The
   * game **MUST** call this API. Otherwise, the game is not shown to users.
   * `firstFrameReady()` **MUST** be called before `gameReady()`.
   */
  export function gameReady(): void;

  /**
   * Saves game data to the YouTube in the form of a serialized string.
   *
   * @return a Promise that completes when saving succeeded and rejects with an
   * `SdkError` when failed.
   */
  export function saveData(data: string): Promise<void>;

  /**
   * Loads game data from the YouTube in the form of a serialized string.
   *
   * @return a Promise that completes when loading succeeded and rejects with an
   * `SdkError` when failed.
   */
  export function loadData(): Promise<string>;

  /**
   * Triggers YouTube to prompt the user to share an invite code. If the user
   * chooses to share, the invite code will be included in the shared URL.
   *
   * Invite codes must be valid UTF-8 and must be a maximum of 8 bytes.
   *
   * See https://developer.mozilla.org/en-US/docs/Glossary/UTF-8 for
   * details on number of bytes for UTF-8 characters.
   */
  export function shareInviteCode(inviteCode: string): Promise<void>;

  /**
   * An object used to pass game-related data from YouTube to the game, such as
   * an invite code.
   */
  export interface GameData {
    getInviteCode: () => string;
    hasInviteCode: () => boolean;
  }

  /**
   * Sets a callback to be triggered when game data becomes available from
   * YouTube. This callback can be triggered at any time.
   */
  export function onGameDataAvailable(
    callback: (gameData: GameData) => void,
  ): VoidFunction;
}

/**
 * The functions and properties related to the game health.
 */
declare namespace ytgame.health {
  /**
   * Logs an error to YouTube. Aggregate information will be accessible on the
   * YouTube Playables health page. This API is best-effort and rate-limited,
   * which can result in data loss.
   */
  export function logError(): void;
  /**
   * Logs a warning to YouTube. Aggregate information will be accessible on the
   * YouTube Playables health webpage. This API is best-effort and rate-limited,
   * which can result in data loss.
   */
  export function logWarning(): void;
}

/**
 * The functions and properties related to the YouTube system.
 */
declare namespace ytgame.system {
  /**
   * Returns whether the game audio is enabled in the YouTube settings. The game
   * **SHOULD** use this to initialize the game audio state.
   */
  export function isAudioEnabled(): boolean;

  /**
   * Sets a callback to be triggered when the audio settings change event is
   * fired from YouTube. The game **MUST** use this API to update the game audio
   * state.
   *
   * @param isAudioEnabled whether the audio is enabled in YouTube settings.
   * @return function to unset the callback.
   *
   */
  export function onAudioEnabledChange(
    callback: (isAudioEnabled: boolean) => void,
  ): () => void;

  /**
   * Sets a callback to be triggered when a pause game event is fired from
   * YouTube. The game has a short window to save any state before it is
   * evicted.
   *
   * @return a function to unset the callback.
   */
  export function onPause(callback: () => void): () => void;

  /**
   * Sets a callback to be triggered when a resume game event is fired from
   * YouTube.
   *
   * @return a function to unset the callback.
   */
  export function onResume(callback: () => void): () => void;

  /**
   * Returns the language that is set in the user's YouTube settings in the
   * form of a BCP-47 language tag.
   *
   * @return a Promise that completes when getting the language succeeded and
   * rejects with an `SdkError` when failed.
   */
  export function getLanguage(): Promise<string>;
}
