module.exports = {
  packagerConfig: {
    icon: 'icons/logo',
    dir: "./dist",
    ignore: [
      "^/public$",
      "^/src$",
      "[.](cmd|user|DotSettings|njsproj|sln)$"
    ],
    "asar": false,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
};
//"make": "electron-forge make --arch=x64 --platform=darwin"
