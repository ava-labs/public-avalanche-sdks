import * as core from '@actions/core';
import * as github from '@actions/github';
import * as colors from 'colorette';

export function run() {
  try {
    console.log(colors.whiteBright('context.ref'), github.context.ref);

    // console.info(colors.whiteBright('🏷️ Added Label: '), colors.blue(labelToAdd));
  } catch (error) {
    core.setFailed((error as { message: string }).message);
  }
}

run();
