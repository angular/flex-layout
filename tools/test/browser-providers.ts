type ContextConfigurationInfo = { target: string, required: boolean };
export interface ConfigurationInfo {
  unitTest: ContextConfigurationInfo;
  e2e: ContextConfigurationInfo;
}

export interface BrowserLauncherInfo {
  base: string;
  flags?: string[];
  version?: string;
  platform?: string;
  device?: string;
  browser?: string;
  browserName?:string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  resolution?:string;
}

export type AliasMap = { [name: string]: string[] };


// Unique place to configure the browsers which are used in the different CI jobs in Sauce Labs (SL)
// and BrowserStack (BS).
// If the target is set to null, then the browser is not run anywhere during CI.
// If a category becomes empty (e.g. BS and required), then the corresponding job must be commented
// out in Travis configuration.
const configuration: { [name: string]: ConfigurationInfo } = {
  'Chrome':       { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Firefox':      { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Firefox':      { unitTest: {target: 'BS', required: true}, e2e: {target: null, required: true}},
  'ChromeBeta':   { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'FirefoxBeta':  { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'ChromeDev':    { unitTest: {target: null, required: true}, e2e: {target: null, required: true}},
  'FirefoxDev':   { unitTest: {target: null, required: true}, e2e: {target: null, required: true}},
  'IE9':          { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'IE10':         { unitTest: {target: null, required: true}, e2e: {target: null, required: true}},
  'IE11':         { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Edge':         { unitTest: {target: 'SL', required: true}, e2e: {target: null, required: true}},
  'Android4.1':   { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Android4.2':   { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Android4.3':   { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Android4.4':   { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Android5':     { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'Safari7':      { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Safari8':      { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'Safari9':      { unitTest: {target: 'BS', required: false}, e2e: {target: null, required: true}},
  'Safari10':     { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'iOS7':         { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'iOS8':         { unitTest: {target: null, required: false}, e2e: {target: null, required: true}},
  'iOS9':         { unitTest: {target: 'SL', required: false}, e2e: {target: null, required: true}},
  'WindowsPhone': { unitTest: {target: 'BS', required: false}, e2e: {target: null, required: true}}
};

export const customLaunchers: { [name: string]: BrowserLauncherInfo } = {
  'ChromeNoSandbox': {
    base: 'Chrome',
    flags: ['--no-sandbox']
  },
  // Chrome set to 1024x768 resolution for *local testing only*.
  // On CI, both SauceLabs and Browserstack already default all browser window sizes to 1024x768.
  'Chrome_1024x768': {
    base : 'Chrome',
    flags: ['--window-size=1024,768']
  },
  'Safari_1024x768': {
    base : 'Safari',
    flags: ['--window-size=1024,768']
  },
  'SL_CHROME': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  'SL_CHROMEBETA': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'beta'
  },
  'SL_CHROMEDEV': {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'dev'
  },
  'SL_FIREFOX': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest'
  },
  'SL_FIREFOXBETA': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'beta'
  },
  'SL_FIREFOXDEV': {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'dev'
  },
  'SL_SAFARI7': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.9',
    version: '7'
  },
  'SL_SAFARI8': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
    version: '8'
  },
  'SL_SAFARI9': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9.0'
    },
  'SL_SAFARI10': {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12',
    version: '10.0'
  },
  'SL_IOS7': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '7.1'
  },
  'SL_IOS8': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '8.4'
  },
  'SL_IOS9': {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '9.1'
  },
  'SL_IE9': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2008',
    version: '9'
  },
  'SL_IE10': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 2012',
    version: '10'
  },
  'SL_IE11': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11.103'
  },
  'SL_EDGE': {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: '14'
  },
  'SL_ANDROID4.1': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.1'
  },
  'SL_ANDROID4.2': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.2'
  },
  'SL_ANDROID4.3': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.3'
  },
  'SL_ANDROID4.4': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.4'
  },
  'SL_ANDROID5': {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '5.1'
  },

  'BS_CHROME': {
    base: 'BrowserStack',
    browser: 'chrome',
    os: 'OS X',
    os_version: 'Yosemite'
  },
  'BS_FIREFOX': {
    base: 'BrowserStack',
    browser: 'firefox',
    os: 'Windows',
    os_version: '10'
  },
  'BS_SAFARI7': {
    base: 'BrowserStack',
    browser: 'safari',
    os: 'OS X',
    os_version: 'Mavericks'
  },
  'BS_SAFARI8': {
    base: 'BrowserStack',
    browser: 'safari',
    os: 'OS X',
    os_version: 'Yosemite'
  },
  'BS_SAFARI9': {
    base: 'BrowserStack',
    browser: 'safari',
    os: 'OS X',
    os_version: 'El Capitan'
  },
  'BS_IOS7': {
    base: 'BrowserStack',
    device: 'iPhone 5S',
    os: 'ios',
    os_version: '7.0',
    resolution: '1024x768'
  },
  'BS_IOS8': {
    base: 'BrowserStack',
    device: 'iPhone 6',
    os: 'ios',
    os_version: '8.3',
    resolution: '1024x768'
  },
  'BS_IOS9': {
    base: 'BrowserStack',
    device: 'iPhone 6S',
    os: 'ios',
    os_version: '9.0',
    resolution: '1024x768'
  },
  'BS_IE9': {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '9.0',
    os: 'Windows',
    os_version: '7'
  },
  'BS_IE10': {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '10.0',
    os: 'Windows',
    os_version: '8'
  },
  'BS_IE11': {
    base: 'BrowserStack',
    browser: 'ie',
    browser_version: '11.0',
    os: 'Windows',
    os_version: '10'
  },
  'BS_EDGE': {
    base: 'BrowserStack',
    browser: 'edge',
    os: 'Windows',
    os_version: '10'
  },
  'BS_WINDOWSPHONE' : {
    base: 'BrowserStack',
    device: 'Nokia Lumia 930',
    os: 'winphone',
    os_version: '8.1'
  },
  'BS_ANDROID5': {
    base: 'BrowserStack',
    device: 'Google Nexus 5',
    os: 'android',
    os_version: '5.0'
  },
  'BS_ANDROID4.4': {
    base: 'BrowserStack',
    device: 'HTC One M8',
    os: 'android',
    os_version: '4.4'
  },
  'BS_ANDROID4.3': {
    base: 'BrowserStack',
    device: 'Samsung Galaxy S4',
    os: 'android',
    os_version: '4.3'
  },
  'BS_ANDROID4.2': {
    base: 'BrowserStack',
    device: 'Google Nexus 4',
    os: 'android',
    os_version: '4.2'
  },
  'BS_ANDROID4.1': {
    base: 'BrowserStack',
    device: 'Google Nexus 7',
    os: 'android',
    os_version: '4.1'
  }
};

const sauceAliases: AliasMap = {
  'ALL': Object.keys(customLaunchers).filter(function(item) {
    return customLaunchers[item].base == 'SauceLabs';
  }),
  'DESKTOP': ['SL_CHROME', 'SL_FIREFOX', 'SL_IE9', 'SL_IE10', 'SL_IE11', 'SL_EDGE', 'SL_SAFARI7',
              'SL_SAFARI8', 'SL_SAFARI9', 'SL_SAFARI10'],
  'MOBILE': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5',
             'SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
  'ANDROID': ['SL_ANDROID4.1', 'SL_ANDROID4.2', 'SL_ANDROID4.3', 'SL_ANDROID4.4', 'SL_ANDROID5'],
  'IE': ['SL_IE9', 'SL_IE10', 'SL_IE11'],
  'IOS': ['SL_IOS7', 'SL_IOS8', 'SL_IOS9'],
  'SAFARI': ['SL_SAFARI7', 'SL_SAFARI8', 'SL_SAFARI9', 'SL_SAFARI10'],
  'BETA': ['SL_CHROMEBETA', 'SL_FIREFOXBETA'],
  'DEV': ['SL_CHROMEDEV', 'SL_FIREFOXDEV'],
  'REQUIRED': buildConfiguration('unitTest', 'SL', true),
  'OPTIONAL': buildConfiguration('unitTest', 'SL', false)
};

const browserstackAliases: AliasMap = {
  'ALL': Object.keys(customLaunchers).filter(function(item) {
    return customLaunchers[item].base == 'BrowserStack';
  }),
  'DESKTOP': ['BS_CHROME', 'BS_FIREFOX', 'BS_IE9', 'BS_IE10', 'BS_IE11', 'BS_EDGE', 'BS_SAFARI7',
              'BS_SAFARI8', 'BS_SAFARI9', 'BS_SAFARI10'],
  'MOBILE': ['BS_ANDROID4.3', 'BS_ANDROID4.4', 'BS_IOS7', 'BS_IOS8', 'BS_IOS9', 'BS_WINDOWSPHONE'],
  'ANDROID': ['BS_ANDROID4.3', 'BS_ANDROID4.4'],
  'IE': ['BS_IE9', 'BS_IE10', 'BS_IE11'],
  'IOS': ['BS_IOS7', 'BS_IOS8', 'BS_IOS9'],
  'SAFARI': ['BS_SAFARI7', 'BS_SAFARI8', 'BS_SAFARI9', 'BS_SAFARI10'],
  'REQUIRED': buildConfiguration('unitTest', 'BS', true),
  'OPTIONAL': buildConfiguration('unitTest', 'BS', false)
};

export const platformMap: { [name: string]: AliasMap } = {
  'saucelabs': sauceAliases,
  'browserstack': browserstackAliases,
};


/** Decode the token for Travis to use. */
function decode(str: string): string {
  return (str || '').split('').reverse().join('');
}


/** Setup the access keys */
if (process.env.TRAVIS) {
  process.env.SAUCE_ACCESS_KEY = decode(process.env.SAUCE_ACCESS_KEY);
  process.env.BROWSER_STACK_ACCESS_KEY = decode(process.env.BROWSER_STACK_ACCESS_KEY);
}

/** Build a list of configuration (custom launcher names). */
function buildConfiguration(type: string, target: string, required: boolean): string[] {
  return Object.keys(configuration)
    .map(item => [item, configuration[item][type]])
    .filter(([item, conf]) => conf.required == required && conf.target == target)
    .map(([item, conf]) => `${target}_${item.toUpperCase()}`);
}
