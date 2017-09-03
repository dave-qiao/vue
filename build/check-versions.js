/**
 * Created by dave 2017/09/03
 * 检查当前环境下的node及npm版本，以应对不同依赖包对其的版本要求
 *
 */
const chalk = require('chalk');  // 改变命令行中字体颜色
const semver = require('semver');  // 语义化版本控制规范
const packageConfig = require('../package.json');  // 引入项目配置文件
const shell = require('shelljs');  // 引入项目配置文件

const exec = (cmd) => {
  return require('child_process').execSync(cmd).toString().trim();  // 子进程异步处理
};

const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version), // 当前系统安装版本
    versionRequirement: packageConfig.engines.node // 项目要求版本
  }
];

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'), // 当前系统安装版本
    versionRequirement: packageConfig.engines.npm // 项目要求版本
  })
}

module.exports = function () {
  const warnings = [];
  for (var i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i];
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  if (warnings.length) {
    console.log('');
    console.log(chalk.yellow('To use this template, you must update following to modules:'));
    console.log();
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i];
      console.log('  ' + warning)
    }
    console.log();
    process.exit(1)
  }
};
