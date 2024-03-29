// tslint:disable:max-line-length
// tslint:disable:no-console
import fs from 'fs';
import path from 'path';
import { config } from './src/config';
import _ from 'lodash/fp';

interface CopyFileTask {
  src: string;
  des: string;
}

interface ReplaceStringTask {
  src: string;
  replaces: {
    old: RegExp | string;
    new: string;
  }[];
}

const log = (...args: any[]) => {
  console.log(...args);
};

export const updateConfig = (environment: string = 'default') => {
  const envFolder = `environments/${environment}`;
  const copyTasks: CopyFileTask[] = [
    { src: `${envFolder}/android/app.keystore`, des: `android/app/app.keystore` },
    { src: `${envFolder}/android/google-services.json`, des: `android/app/google-services.json` },
    { src: `${envFolder}/android/gradle.properties`, des: `android/gradle.properties` },
    { src: `${envFolder}/fastlane/googlePlaySecretKey.json`, des: `fastlane/googlePlaySecretKey.json` },
    { src: `${envFolder}/ios/GoogleService-Info.plist`, des: `ios/mobile/GoogleService-Info.plist` },
    { src: `${envFolder}/override_config.json`, des: `src/config/override_config.json` },
  ];
  for (const copyTask of copyTasks) {
    if (!fs.existsSync(copyTask.src)) {
      continue;
    }
    fs.copyFileSync(copyTask.src, copyTask.des);
    log(`copied ${copyTask.src} to ${copyTask.des}`);
  }

  // get google
  const googleServiceInfoContent = fs.readFileSync(`${envFolder}/ios/GoogleService-Info.plist`, { encoding: 'utf8' });
  const googleReverseClientId = googleServiceInfoContent.match(/com.googleusercontent.apps.[\w,-]*/);

  const overrideConfig = JSON.parse(fs.readFileSync(`${envFolder}/override_config.json`, { encoding: 'utf8' }));
  const newConfig = _.merge(config, overrideConfig);
  const replaceTasks: ReplaceStringTask[] = [
    {
      src: path.resolve(__dirname, `./android/app/build.gradle`),
      replaces: [
        {
          old: /applicationId \"[\w,.]*\"/,
          new: `applicationId "${newConfig.android.applicationId}"`,
        },
      ],
    },
    {
      src: path.resolve(__dirname, `./android/app/src/main/res/values/strings.xml`),
      replaces: [
        {
          old: /<string name=\"app_name\">[\w, ,.,-]*<\/string>/,
          new: `<string name="app_name">${newConfig.android.appName}</string>`,
        },
        {
          old: /<string name=\"facebook_app_id\">[\w]*<\/string>/,
          new: `<string name="facebook_app_id">${newConfig.fb.id}</string>`,
        },
        {
          old: /<string name=\"fb_login_protocol_scheme\">[\w]*<\/string>/,
          new: `<string name="fb_login_protocol_scheme">fb${newConfig.fb.id}</string>`,
        },
      ],
    },
    {
      src: path.resolve(__dirname, `./ios/mobile/Info.plist`),
      replaces: [
        {
          old: /<key>CFBundleName<\/key>[\n,	, ]*<string>[\w, ,.,-]*<\/string>/,
          new: `<key>CFBundleName</key>\n	<string>${newConfig.ios.appName}</string>`,
        },
        {
          old: /<key>CFBundleDisplayName<\/key>[\n,	, ]*<string>[\w, ,.,-]*<\/string>/,
          new: `<key>CFBundleDisplayName<\/key>\n	<string>${newConfig.ios.appName}</string>`,
        },
        {
          old: /<string>fburl<\/string>[\n,	, ]*<key>CFBundleURLSchemes<\/key>[\n,	, ]*<array>[\n,	, ]*<string>\w+<\/string>[\n,	, ]*<\/array>/,
          new: `<string>fburl</string>\n			<key>CFBundleURLSchemes<\/key>\n			<array>\n				<string>fb${newConfig.fb.id}</string>\n			<\/array>`,
        },
        {
          old: /<string>googleurl<\/string>[\n,	, ]*<key>CFBundleURLSchemes<\/key>[\n,	, ]*<array>[\n,	, ]*<string>[\w,.,-]*<\/string>[\n,	, ]*<\/array>/,
          new: `<string>googleurl</string>\n			<key>CFBundleURLSchemes<\/key>\n			<array>\n				<string>${
            googleReverseClientId ? googleReverseClientId[0] : ''
          }</string>\n			<\/array>`,
        },
        {
          old: /<key>FacebookAppID<\/key>[\n,	, ]*<string>[\w, ,.,-]*<\/string>/,
          new: `<key>FacebookAppID</key>\n	<string>${newConfig.fb.id}</string>`,
        },
        {
          old: /<key>FacebookDisplayName<\/key>[\n,	, ]*<string>[\w, ,.,-,.]*<\/string>/,
          new: `<key>FacebookDisplayName</key>\n	<string>${newConfig.ios.appName}</string>`,
        },
      ],
    },
    {
      src: path.resolve(__dirname, `./ios/mobile.xcodeproj/project.pbxproj`),
      replaces: [
        {
          old: /PRODUCT_BUNDLE_IDENTIFIER = [\w,., ]*;/g,
          new: `PRODUCT_BUNDLE_IDENTIFIER = ${newConfig.ios.bundleId};`,
        },
      ],
    },
  ];
  for (const replaceTask of replaceTasks) {
    if (!fs.existsSync(replaceTask.src)) {
      continue;
    }
    const oldContent = fs.readFileSync(replaceTask.src, { encoding: 'utf8' });

    let newContent = oldContent;
    for (const replace of replaceTask.replaces) {
      newContent = newContent.replace(replace.old, replace.new);
    }

    fs.writeFileSync(replaceTask.src, newContent);
    log(`updated ${replaceTask.src}`);
  }
};

export const updateVersion = () => {
  const replaceTasks: ReplaceStringTask[] = [
    {
      src: path.resolve(__dirname, `./android/app/build.gradle`),
      replaces: [
        {
          old: /versionCode [0-9]*/,
          new: `versionCode ${config.android.versionCode}`,
        },
        {
          old: /versionName "[0-9,.]*"/,
          new: `versionName "${config.android.version}"`,
        },
      ],
    },
    {
      src: path.resolve(__dirname, `./ios/mobile/Info.plist`),
      replaces: [
        {
          old: /<key>CFBundleVersion<\/key>[\n,	, ]*<string>[\w, ,.,-]*<\/string>/,
          new: `<key>CFBundleVersion</key>\n	<string>${config.ios.build}</string>`,
        },
        {
          old: /<key>CFBundleShortVersionString<\/key>[\n,	, ]*<string>[\w, ,.,-]*<\/string>/,
          new: `<key>CFBundleShortVersionString<\/key>\n	<string>${config.ios.version}</string>`,
        },
      ],
    },
  ];
  for (const replaceTask of replaceTasks) {
    if (!fs.existsSync(replaceTask.src)) {
      continue;
    }
    const oldContent = fs.readFileSync(replaceTask.src, { encoding: 'utf8' });

    let newContent = oldContent;
    for (const replace of replaceTask.replaces) {
      newContent = newContent.replace(replace.old, replace.new);
    }

    fs.writeFileSync(replaceTask.src, newContent);
    log(`updated ${replaceTask.src}`);
  }
};

const run = () => {
  const command = process.argv[2];
  switch (command) {
    case 'update-version':
      updateVersion();
      break;
    default:
      updateConfig(command);
  }
};

run();
