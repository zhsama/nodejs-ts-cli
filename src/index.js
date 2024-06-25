#!/usr/bin/env node
import { Command } from 'commander'
import inquirer from 'inquirer'
import download from 'download-git-repo'
import chalk from 'chalk'
import ora from 'ora'

const program = new Command()

const repos = {
  'node-ts-template': 'github:zhsama/node-ts-template#main',
  'node-typescript-boilerplate': 'github:jsynowiec/node-typescript-boilerplate#main',
}

function initAction() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: '请输入项目名称',
        name: 'name',
      },
      {
        type: 'list',
        message: '请选择项目模板',
        name: 'template',
        choices: ['node-ts-template', 'node-typescript-boilerplate'],
      },
    ])
    .then((res) => {
      const spinner = ora('download template......').start()
      const repo = repos[res.template]
      console.log(repo)
      const dest = res.name
      const options = { clone: true }
      const status = ora('download template......').start()
      download(repo, dest, options, (err) => {
        if (err) {
          console.log(chalk.red(err))
          status.fail()
          spinner.fail()
        }
        else {
          console.log(chalk.green('成功'))
          status.succeed()
          spinner.succeed()
        }
      })
    })
}

// 使用 init 时
program.command('init').description('创建项目').action(initAction)

program.parse(program.argv)
