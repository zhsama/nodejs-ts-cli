#!/usr/bin/env node
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as process from 'node:process'
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
        validate: (input) => {
          const projectPath = path.join(process.cwd(), input)
          if (fs.existsSync(projectPath)) {
            console.log(chalk.red('\n当前目录下已存在同名文件夹，请输入其他项目名称。'))
            return false
          }
          return true
        },
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
