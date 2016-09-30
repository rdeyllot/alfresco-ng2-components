// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function() {};

var builtPath = '/base/dist/';

function isJsFile(path) {
    return path.slice(-3) == '.js';
}

function isSpecFile(path) {
    return /\.spec\.(.*\.)?js$/.test(path);
}

function isBuiltFile(path) {
    return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
    .filter(isSpecFile)
    .filter(isBuiltFile);

var paths = {
    // paths serve as alias
    'npm:': 'base/node_modules/'
};

var map = {
    'app': 'base/dist',
    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    // testing
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
    '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',

    // other libraries
    'rxjs': 'npm:rxjs',
    'ng2-translate': 'npm:ng2-translate',

    'alfresco-js-api': 'npm:alfresco-js-api/dist',
    'ng2-activiti-form': 'npm:ng2-activiti-form/dist',
    'ng2-activiti-processlist': 'npm:ng2-activiti-processlist/dist',
    'ng2-activiti-tasklist': 'npm:ng2-activiti-tasklist/dist',
    'ng2-alfresco-core': 'npm:ng2-alfresco-core/dist',
    'ng2-alfresco-datatable': 'npm:ng2-alfresco-datatable/dist',
    'ng2-alfresco-documentlist': 'npm:ng2-alfresco-documentlist/dist',
    'ng2-alfresco-login': 'npm:ng2-alfresco-login/dist',
    'ng2-alfresco-search': 'npm:ng2-alfresco-search/dist',
    'ng2-alfresco-tag': 'npm:ng2-alfresco-tag/dist',
    'ng2-alfresco-upload': 'npm:ng2-alfresco-upload/dist',
    'ng2-alfresco-viewer': 'npm:ng2-alfresco-viewer/dist',
    'ng2-alfresco-webscript': 'npm:ng2-alfresco-webscript/dist',
    'ng2-alfresco-userinfo': 'npm:ng2-alfresco-userinfo/dist'
};

var packages = {
    'app': { main: 'main.js',  defaultExtension: 'js' },
    'rxjs': {  defaultExtension: 'js' },
    'ng2-translate': { defaultExtension: 'js' },

    'alfresco-js-api': { main: './alfresco-js-api.js', defaultExtension: 'js'},
    'ng2-activiti-form': { main: './index.js', defaultExtension: 'js'},
    'ng2-activiti-processlist': { main: './index.js', defaultExtension: 'js'},
    'ng2-activiti-tasklist': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-core': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-datatable': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-documentlist': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-login': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-search': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-tag': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-upload': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-viewer': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-webscript': { main: './index.js', defaultExtension: 'js'},
    'ng2-alfresco-userinfo': { main: './index.js', defaultExtension: 'js'}
};

var config = {
    paths: paths,
    map: map,
    packages: packages
};

System.config(config);

System.import('@angular/core/testing')
    .then(initTestBed)
    .then(initTesting);

function initTestBed(){
    return Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])
    .then(function (providers) {
        var coreTesting    = providers[0];
        var browserTesting = providers[1];

        coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting());
    })
}

// Import all spec files and start karma
function initTesting () {
    return Promise.all(
        allSpecFiles.map(function (moduleName) {
            return System.import(moduleName);
        })
    )
    .then(__karma__.start, __karma__.error);
}