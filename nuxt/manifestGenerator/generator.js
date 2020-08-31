/*!
 * @nuxt/generator v2.14.3 (c) 2016-2020

 * - All the amazing contributors
 * Released under the MIT License.
 * Website: https://nuxtjs.org
*/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const path = require('path');
const chalk = require('chalk');
const consola = require('consola');
const fsExtra = require('fs-extra');
const htmlMinifier = require('html-minifier');
const nodeHtmlParser = require('node-html-parser');
const crypto = require('crypto');
const utils = require('@nuxt/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
const consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
const fsExtra__default = /*#__PURE__*/_interopDefaultLegacy(fsExtra);
const htmlMinifier__default = /*#__PURE__*/_interopDefaultLegacy(htmlMinifier);
const crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function isObject(val) {
  return val !== null && _typeof(val) === 'object' && !Array.isArray(val);
}

function _defu(baseObj, defaults) {
  if (!isObject(baseObj)) {
    return _defu({}, defaults);
  }

  if (!isObject(defaults)) {
    return _defu(baseObj, {});
  }

  var obj = Object.assign({}, defaults);

  for (var key in baseObj) {
    if (key === '__proto__' || key === 'constructor') {
      continue;
    }

    var val = baseObj[key];

    if (val === null) {
      continue;
    }

    if (isObject(val) && isObject(obj[key])) {
      obj[key] = _defu(val, obj[key]);
    } else {
      obj[key] = val;
    }
  }

  return obj;
}

function defu() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.reduce(_defu, {});
}

var defu_1 = defu;

class Generator {
  constructor (nuxt, builder) {
    this.nuxt = nuxt;
    this.options = nuxt.options;
    this.builder = builder;

    // Set variables
    this.isFullStatic = utils.isFullStatic(this.options);
    this.staticRoutes = path__default['default'].resolve(this.options.srcDir, this.options.dir.static);
    this.srcBuiltPath = path__default['default'].resolve(this.options.buildDir, 'dist', 'client');
    this.distPath = this.options.generate.dir;
    this.distNuxtPath = path__default['default'].join(
      this.distPath,
      utils.isUrl(this.options.build.publicPath) ? '' : this.options.build.publicPath
    );
    // Payloads for full static
    if (this.isFullStatic) {
      const { staticAssets } = this.options.generate;
      this.staticAssetsDir = path__default['default'].resolve(this.distNuxtPath, staticAssets.dir, staticAssets.version);
      this.staticAssetsBase = this.options.generate.staticAssets.versionBase;
    }

    // Shared payload
    this._payload = null;
    this.setPayload = (payload) => {
      this._payload = defu_1(payload, this._payload);
    };
  }

  async generate ({ build = true, init = true } = {}) {
    consola__default['default'].debug('Initializing generator...');
    await this.initiate({ build, init });

    consola__default['default'].debug('Preparing routes for generate...');
    const routes = await this.initRoutes();

    consola__default['default'].info('Generating pages' + (this.isFullStatic ? ' with full static mode' : ''));
    const errors = await this.generateRoutes(routes);

    await this.afterGenerate();

    // Done hook
    await this.nuxt.callHook('generate:done', this, errors);
    await this.nuxt.callHook('export:done', this, { errors });

    return { errors }
  }

  async initiate ({ build = true, init = true } = {}) {
    // Wait for nuxt be ready
    await this.nuxt.ready();

    // Call before hook
    await this.nuxt.callHook('generate:before', this, this.options.generate);
    await this.nuxt.callHook('export:before', this);

    if (build) {
      // Add flag to set process.static
      this.builder.forGenerate();

      // Start build process
      await this.builder.build();
    } else {
      const hasBuilt = await fsExtra__default['default'].exists(path__default['default'].resolve(this.options.buildDir, 'dist', 'server', 'client.manifest.json'));
      if (!hasBuilt) {
        throw new Error(
          `No build files found in ${this.srcBuiltPath}.\nPlease run \`nuxt build\``
        )
      }
    }

    // Initialize dist directory
    if (init) {
      await this.initDist();
    }
  }

  async initRoutes (...args) {
    // Resolve config.generate.routes promises before generating the routes
    let generateRoutes = [];
    if (this.options.router.mode !== 'hash') {
      try {
        generateRoutes = await utils.promisifyRoute(
          this.options.generate.routes || [],
          ...args
        );
      } catch (e) {
        consola__default['default'].error('Could not resolve routes');
        throw e // eslint-disable-line no-unreachable
      }
    }
    let routes = [];
    // Generate only index.html for router.mode = 'hash' or client-side apps
    if (this.options.router.mode === 'hash') {
      routes = ['/'];
    } else {
      routes = utils.flatRoutes(this.getAppRoutes());
    }
    routes = routes.filter(route => this.shouldGenerateRoute(route));
    routes = this.decorateWithPayloads(routes, generateRoutes);

    // extendRoutes hook
    await this.nuxt.callHook('generate:extendRoutes', routes);
    await this.nuxt.callHook('export:extendRoutes', { routes });

    return routes
  }

  shouldGenerateRoute (route) {
    return this.options.generate.exclude.every((regex) => {
      if (typeof regex === 'string') {
        return regex !== route
      }
      return !regex.test(route)
    })
  }

  getBuildConfig () {
    try {
      return require(path__default['default'].join(this.options.buildDir, 'nuxt/config.json'))
    } catch (err) {
      return null
    }
  }

  getAppRoutes () {
    return require(path__default['default'].join(this.options.buildDir, 'routes.json'))
  }

  async generateRoutes (routes) {
    const errors = [];

    this.routes = [];
    this.generatedRoutes = new Set();

    routes.forEach(({ route, ...props }) => {
      route = decodeURI(route);
      this.routes.push({ route, ...props });
      // Add routes to the tracked generated routes (for crawler)
      this.generatedRoutes.add(route);
    });

    // Start generate process
    while (this.routes.length) {
      let n = 0;
      await Promise.all(
        this.routes
          .splice(0, this.options.generate.concurrency)
          .map(async ({ route, payload }) => {
            await utils.waitFor(n++ * this.options.generate.interval);
            await this.generateRoute({ route, payload, errors });
          })
      );
    }

    // Improve string representation for errors
    // TODO: Use consola for more consistency
    errors.toString = () => this._formatErrors(errors);

    return errors
  }

  _formatErrors (errors) {
    return errors
      .map(({ type, route, error }) => {
        const isHandled = type === 'handled';
        const color = isHandled ? 'yellow' : 'red';

        let line = chalk__default['default'][color](` ${route}\n\n`);

        if (isHandled) {
          line += chalk__default['default'].grey(JSON.stringify(error, undefined, 2) + '\n');
        } else {
          line += chalk__default['default'].grey(error.stack || error.message || `${error}`);
        }

        return line
      })
      .join('\n')
  }

  async afterGenerate () {
    const { fallback } = this.options.generate;

    // Disable SPA fallback if value isn't a non-empty string
    if (typeof fallback !== 'string' || !fallback) {
      return
    }

    const fallbackPath = path__default['default'].join(this.distPath, fallback);

    // Prevent conflicts
    if (await fsExtra__default['default'].exists(fallbackPath)) {
      consola__default['default'].warn(`SPA fallback was configured, but the configured path (${fallbackPath}) already exists.`);
      return
    }

    // Render and write the SPA template to the fallback path
    let { html } = await this.nuxt.server.renderRoute('/', {
      spa: true,
      staticAssetsBase: this.staticAssetsBase
    });

    try {
      html = this.minifyHtml(html);
    } catch (error) {
      consola__default['default'].warn('HTML minification failed for SPA fallback');
    }

    const { csp } = this.options.render;

    // Calculate CSP hashes
    if (csp) {

      const { allowedSources, policies } = csp;

      const policyObjectAvailable = typeof policies === 'object' && policies !== null && !Array.isArray(policies);

      // Only add the hash if 'unsafe-inline' rule isn't present to avoid conflicts (#5387)
      const containsUnsafeInlineScriptSrc = policyObjectAvailable && policies['script-src'] && policies['script-src'].includes('\'unsafe-inline\'');
      const shouldHashCspScriptSrc = csp.unsafeInlineCompatibility || !containsUnsafeInlineScriptSrc;

      const inlineScripts = [];
      const inlineStyles = [];
      const cspScriptSrcHashes = [];
      const cspStyleSrcHashes = [];
      const dom = nodeHtmlParser.parse(html, {script: true, style: true});
      if (shouldHashCspScriptSrc) {

        const inlineScriptTags = dom.querySelectorAll('script');
        for (const inlineScriptTag of inlineScriptTags) {
          inlineScripts.push(inlineScriptTag.rawText);
        }
        for (const script of inlineScripts) {
          const hash = crypto__default['default'].createHash(csp.hashAlgorithm);
          hash.update(script);
          cspScriptSrcHashes.push(`'${csp.hashAlgorithm}-${hash.digest('base64')}'`);
        }

        const inlineStyleTags = dom.querySelectorAll('style');
        for (const inlineStyleTag of inlineStyleTags) {
          inlineStyles.push(inlineStyleTag.rawText);
        }
        for (const style of inlineStyles) {
          const hash = crypto__default['default'].createHash(csp.hashAlgorithm);
          hash.update(style);
          cspStyleSrcHashes.push(`'${csp.hashAlgorithm}-${hash.digest('base64')}'`);
        }
      }

      let isReportOnly, cspHeader, cspString;

      if (csp.showResult || csp.saveResult ) {
        isReportOnly = !!csp.reportOnly;
        cspHeader = isReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
        cspString = getCspString({ cspScriptSrcHashes, cspStyleSrcHashes, allowedSources, policies, isReportOnly });
      }
      // Show CSP header in console
      if (csp.showResult) {
        consola__default['default'].info(`CSP Header: ${cspHeader}: ${cspString}`);
      }
      // Save CSP header into file
      if (csp.saveResult) {
        await fsExtra__default['default'].writeFile( path__default['default'].join( this.options.generate.dir, csp.saveResult), `${cspHeader}: ${cspString}`, 'utf8');
        consola__default['default'].success(`CSP Header saved as: ${csp.saveResult}`);
      }

      // Add csp meta tags
      if (csp.addMeta) {
        isReportOnly = false;
        try { // report-uri is not allowed in HTML meta tag
          delete policies['report-uri'];
        } catch (e) {  }
        cspString = getCspString({ cspScriptSrcHashes, cspStyleSrcHashes, allowedSources, policies, isReportOnly });

        const head = dom.querySelector('head');

        head.appendChild(`<meta http-equiv="Content-Security-Policy" content="${cspString}">`);
        html = dom.toString();
      }
    }

    await fsExtra__default['default'].writeFile(fallbackPath, html, 'utf8');
    consola__default['default'].success('Client-side fallback created: `' + fallback + '`');
  }

  async initDist () {
    // Clean destination folder
    await fsExtra__default['default'].emptyDir(this.distPath);

    consola__default['default'].info(`Generating output directory: ${path__default['default'].basename(this.distPath)}/`);
    await this.nuxt.callHook('generate:distRemoved', this);
    await this.nuxt.callHook('export:distRemoved', this);

    // Copy static and built files
    if (await fsExtra__default['default'].exists(this.staticRoutes)) {
      await fsExtra__default['default'].copy(this.staticRoutes, this.distPath);
    }
    // Copy .nuxt/dist/client/ to dist/_nuxt/
    await fsExtra__default['default'].copy(this.srcBuiltPath, this.distNuxtPath);

    if (this.payloadDir) {
      await fsExtra__default['default'].ensureDir(this.payloadDir);
    }

    // Add .nojekyll file to let GitHub Pages add the _nuxt/ folder
    // https://help.github.com/articles/files-that-start-with-an-underscore-are-missing/
    const nojekyllPath = path__default['default'].resolve(this.distPath, '.nojekyll');
    fsExtra__default['default'].writeFile(nojekyllPath, '');

    await this.nuxt.callHook('generate:distCopied', this);
    await this.nuxt.callHook('export:distCopied', this);
  }

  decorateWithPayloads (routes, generateRoutes) {
    const routeMap = {};
    // Fill routeMap for known routes
    routes.forEach((route) => {
      routeMap[route] = { route, payload: null };
    });
    // Fill routeMap with given generate.routes
    generateRoutes.forEach((route) => {
      // route is either a string or like { route : '/my_route/1', payload: {} }
      const path = utils.isString(route) ? route : route.route;
      routeMap[path] = {
        route: path,
        payload: route.payload || null
      };
    });
    return Object.values(routeMap)
  }

  async generateRoute ({ route, payload = {}, errors = [] }) {
    let html;
    const pageErrors = [];

    const setPayload = (_payload) => {
      payload = defu_1(_payload, payload);
    };

    // Apply shared payload
    if (this._payload) {
      payload = defu_1(payload, this._payload);
    }

    await this.nuxt.callHook('generate:route', { route, setPayload });
    await this.nuxt.callHook('export:route', { route, setPayload });

    try {
      const renderContext = {
        payload,
        staticAssetsBase: this.staticAssetsBase
      };
      const res = await this.nuxt.server.renderRoute(route, renderContext);
      html = res.html;

      // If crawler activated and called from generateRoutes()
      if (this.options.generate.crawler && this.options.render.ssr) {
        const possibleTrailingSlash = this.options.router.trailingSlash ? '/' : '';
        nodeHtmlParser.parse(html).querySelectorAll('a').map((el) => {
          const sanitizedHref = (el.getAttribute('href') || '')
            .replace(this.options.router.base, '/')
            .split('?')[0]
            .split('#')[0]
            .replace(/\/+$/, '')
            .trim();

          const route = decodeURI(sanitizedHref + possibleTrailingSlash);

          if (route.startsWith('/') && !route.startsWith('//') && !path__default['default'].extname(route) && this.shouldGenerateRoute(route) && !this.generatedRoutes.has(route)) {
            this.generatedRoutes.add(route);
            this.routes.push({ route });
          }
        });
      }

      // Save Static Assets
      if (this.staticAssetsDir && renderContext.staticAssets) {
        for (const asset of renderContext.staticAssets) {
          const assetPath = path__default['default'].join(this.staticAssetsDir, asset.path);
          await fsExtra__default['default'].ensureDir(path__default['default'].dirname(assetPath));
          await fsExtra__default['default'].writeFile(assetPath, asset.src, 'utf-8');
        }
      }

      if (res.error) {
        pageErrors.push({ type: 'handled', route, error: res.error });
      }
    } catch (err) {
      pageErrors.push({ type: 'unhandled', route, error: err });
      errors.push(...pageErrors);

      await this.nuxt.callHook('generate:routeFailed', { route, errors: pageErrors });
      await this.nuxt.callHook('export:routeFailed', { route, errors: pageErrors });
      consola__default['default'].error(this._formatErrors(pageErrors));

      return false
    }

    try {
      html = this.minifyHtml(html);
    } catch (err) {
      const minifyErr = new Error(
        `HTML minification failed. Make sure the route generates valid HTML. Failed HTML:\n ${html}`
      );
      pageErrors.push({ type: 'unhandled', route, error: minifyErr });
    }

    let fileName;

    if (this.options.generate.subFolders) {
      fileName = path__default['default'].join(route, path__default['default'].sep, 'index.html'); // /about -> /about/index.html
      fileName = fileName === '/404/index.html' ? '/404.html' : fileName; // /404 -> /404.html
    } else {
      const normalizedRoute = route.replace(/\/$/, '');
      fileName = route.length > 1 ? path__default['default'].join(path__default['default'].sep, normalizedRoute + '.html') : path__default['default'].join(path__default['default'].sep, 'index.html');
    }

    // Call hook to let user update the path & html
    const page = {
      route,
      path: fileName,
      html,
      exclude: false,
      errors: pageErrors
    };
    page.page = page; // Backward compatibility for export:page hook
    await this.nuxt.callHook('generate:page', page);

    if (page.exclude) {
      return false
    }
    page.path = path__default['default'].join(this.distPath, page.path);

    // Make sure the sub folders are created
    await fsExtra__default['default'].mkdirp(path__default['default'].dirname(page.path));
    await fsExtra__default['default'].writeFile(page.path, page.html, 'utf8');

    await this.nuxt.callHook('generate:routeCreated', { route, path: page.path, errors: pageErrors });
    await this.nuxt.callHook('export:routeCreated', { route, path: page.path, errors: pageErrors });

    if (pageErrors.length) {
      consola__default['default'].error(`Error generating route "${route}": ${pageErrors.map(e => e.error.message).join(', ')}`);
      errors.push(...pageErrors);
    } else {
      consola__default['default'].success(`Generated route "${route}"`);
    }

    return true
  }

  minifyHtml (html) {
    let minificationOptions = this.options.build.html.minify;

    // Legacy: Override minification options with generate.minify if present
    // TODO: Remove in Nuxt version 3
    if (typeof this.options.generate.minify !== 'undefined') {
      minificationOptions = this.options.generate.minify;
      consola__default['default'].warn('generate.minify has been deprecated and will be removed in the next major version.' +
        ' Use build.html.minify instead!');
    }

    if (!minificationOptions) {
      return html
    }

    return htmlMinifier__default['default'].minify(html, minificationOptions)
  }
}

const getCspString = ({ cspScriptSrcHashes, cspStyleSrcHashes, allowedSources, policies, isReportOnly }) => {
  const joinedScriptHashes = cspScriptSrcHashes.join(' ');
  const baseScriptCspStr = `script-src 'self' ${joinedScriptHashes}`;

  const joinedStyleHashes = cspStyleSrcHashes.join(' ');
  const baseStyleCspStr = `style-src 'self' ${joinedStyleHashes}`;


  const policyObjectAvailable = typeof policies === 'object' && policies !== null && !Array.isArray(policies);

  if (Array.isArray(allowedSources) && allowedSources.length) {
    const cspStr = `${baseScriptCspStr} ${allowedSources.join(' ')}; ${baseStyleCspStr} ${allowedSources.join(' ')}`;
    return isReportOnly && policyObjectAvailable && !!policies['report-uri'] ? `${cspStr}; report-uri ${policies['report-uri']};` : `${cspStr}`
  }

  if (policyObjectAvailable) {
    const transformedPolicyObject = transformPolicyObject(policies, cspScriptSrcHashes, cspStyleSrcHashes);
    return Object.entries(transformedPolicyObject).map(([k, v]) => `${k} ${Array.isArray(v) ? v.join(' ') : v}`).join('; ')
  }

  return baseScriptCspStr + '; ' + baseStyleCspStr;
};

const transformPolicyObject = (policies, cspScriptSrcHashes, cspStyleSrcHashes) => {
  const userHasDefinedScriptSrc = policies['script-src'] && Array.isArray(policies['script-src']);
  const additionalScriptPolicies = userHasDefinedScriptSrc ? policies['script-src'] : [];

  const userHasDefinedStyleSrc = policies['style-src'] && Array.isArray(policies['style-src']);
  const additionalStylePolicies = userHasDefinedStyleSrc ? policies['style-src'] : [];

  // Self is always needed for inline-scripts, so add it, no matter if the user specified script-src himself.
  const scriptHashAndPolicyList = cspScriptSrcHashes.concat('\'self\'', additionalScriptPolicies);
  const styleHashAndPolicyList = cspStyleSrcHashes.concat('\'self\'', additionalStylePolicies);

  return { ...policies, 'script-src': scriptHashAndPolicyList, 'style-src': styleHashAndPolicyList }
};

function getGenerator (nuxt) {
  return new Generator(nuxt)
}

exports.Generator = Generator;
exports.getGenerator = getGenerator;
