// The default @pixi/extension-scripts Jest config, plus support for ESM-only dependencies
export default {
    preset: 'ts-jest',
    runner: '@kayahr/jest-electron-runner',
    testEnvironment: '@kayahr/jest-electron-runner/environment',
    setupFilesAfterEnv: ['jest-extended/all'],
    testMatch: ['<rootDir>/**/__tests__/*.test.ts'],
    transform: {
        '\\.(vert|frag|wgsl)$': 'jest-raw-loader',
        // pixi.js uses earcut and @pixi/3d uses meshoptimizer. All three are
        // only published as ES modules, so Jest has to compile them.
        '\\.m?js$': ['ts-jest', { tsconfig: { allowJs: true } }],
    },
    transformIgnorePatterns: ['/node_modules/(?!(earcut|@pixi/3d|meshoptimizer)/)'],
};
