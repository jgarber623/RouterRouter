const puppeteer = require('puppeteer');

const failedStatus =  { color: 31, text: 'F' };
const passedStatus =  { color: 32, text: '.' };
const pendingStatus = { color: 33, text: '*' };

function colorizedText(color, text) {
  return '\033[' + color + 'm' + text + '\033[0m';
};

puppeteer.launch({ args: ['--no-sandbox'] }).then(async browser => {
  console.log('Started');

  const page = await browser.newPage();

  let statuses =     [];
  let pendingSpecs = [];
  let failedSpecs =  [];

  await page.goto(process.argv[2]);
  await page.waitForSelector('.jasmine-duration');

  const [executionTime, specs, stats] = await page.evaluate(() => {
    return [
      jsApiReporter.executionTime(),
      jsApiReporter.specs(),
      document.querySelector('.jasmine-alert > .jasmine-bar').textContent
    ]
  });

  specs.forEach(spec => {
    switch(spec.status) {
      case 'failed':
        statuses.push(failedStatus);

        failedSpecs.push({
          name: spec.fullName,
          messages: spec.failedExpectations.map(expectation => {
            return expectation.message;
          })
        });

        break;
      case 'pending':
        statuses.push(pendingStatus);

        pendingSpecs.push({
          name: spec.fullName,
          reason: spec.pendingReason
        });

        break;
      default:
        statuses.push(passedStatus);
    }
  });

  console.log(statuses.map(status => {
    return colorizedText(status.color, status.text);
  }).join(''));

  console.log('');

  if (pendingSpecs.length) {
    console.log('Pending:', '');
    console.log('');

    pendingSpecs.forEach((spec, index) => {
      let normalizedIndex = index + 1;

      console.log(`  ${normalizedIndex}) ${spec.name}`);
      console.log(colorizedText(33, `     ${normalizedIndex > 9 ? ' ' : ''}${spec.reason.length ? spec.reason : 'No reason given'}`));
      console.log('');
    });

    console.log('');
  }

  if (failedSpecs.length) {
    console.log('Failures:');
    console.log('');

    failedSpecs.forEach((spec, index) => {
      let normalizedIndex = index + 1;

      console.log(`  ${normalizedIndex}) ${spec.name}`);

      spec.messages.forEach(message => {
        console.log(`     ${normalizedIndex > 9 ? ' ' : ''}Error: ${colorizedText(31, message)}`);
      });

      console.log('');
    });

    console.log('');
  }

  console.log(stats);
  console.log('Finished in ' + (executionTime / 1000) + ' seconds');

  await browser.close();

  process.exit(failedSpecs.length ? 1 : 0);
});
