const path = require("path");
// console.log(process.env.NODE_ENV)
module.exports = {
	// 基本路径
	publicPath: process.env.NODE_ENV === "production" ? "" : "/",
	// 输出文件目录
	outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
	// eslint-loader 是否在保存的时候语法检查（这个开启后很烦人）
	lintOnSave: false,
	/**
	 * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	 **/
	chainWebpack: config => {
		const svgRule = config.module.rule("svg");
		svgRule.uses.clear();
		svgRule
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]",
				include: ["./src/icons"]
			});

	},
	configureWebpack: config => {
		config.resolve = {
			// 配置路径解析别名。
			// 这个意思是‘打包后自动添加后缀后’,写代码时不用添加文件的后缀名
			extensions: ['.js', '.json', '.vue'],
			// 类似于 “src目录下” 就可以用 “@” 来代替
			alias: {
				// 全局组件的配置
				'vue': "vue/dist/vue.js",
				'@': path.resolve(__dirname, './src'),
				'@c': path.resolve(__dirname, './src/components'),
				// 'public': path.resolve(__dirname, './public'),
				// 'common': path.resolve(__dirname, './src/common'),
				// 'api': path.resolve(__dirname, './src/api'),
				// 'views': path.resolve(__dirname, './src/views'),
				// 'data': path.resolve(__dirname, './src/data')
			}
		}
	},
	// 生产环境是否生成 source、Map 文件（缺点：打包后的文件增加10kb;优点：错误指示会更加准确）
	productionSourceMap: false,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		// 这个东西开启，下面的样式才生效
		sourceMap: true,
		// css预设器配置项
		loaderOptions: {
			sass: {
				prependData: `@import "./src/styles/main.scss";`
			}
		}
		// 启用 CSS modules for all css / pre-processor files.
		// modules: false
	},
	// use thread-loader for babel & TS in production build
	// enabled by default if the machine has more than 1 cores
	parallel: require("os").cpus().length > 1,
	/**
	 *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	 */
	pwa: {},
	// webpack-dev-server 相关配置
	devServer: {
		open: false, // 编译完成是否打开网页
		host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
		port: 8080, // 访问端口
		https: false, // 编译失败时刷新页面
		hot: true, // 开启热加载。生产（上线）环境下不能开启，会报错
		hotOnly: false,
		//配置代理跨域
		proxy: {
			// 在开发环境下有效
			'/devapi': {
				target: "http://www.web-jshtml.cn/productapi/token", //后面加上“token”是因为会返回一个“用户信息加上token”的接口
				// ws: true,
				changOrigin: true,
				pathRewrite: { //http://localhost:8090/api/getSms/
					'^/devapi': '', //http://www.web-jshtml.cn/productapi/空
				}
			}
		},
		overlay: {
			// 全屏模式下是否显示脚本错误
			warnings: true,
			errors: true
		}
		// before: app => {}
	},
	/**
	 * 第三方插件配置
	 */
	pluginOptions: {}
};
