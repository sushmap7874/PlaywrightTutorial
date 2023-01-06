1. To run the test, Use below command

"npx playwright test" or "npx playwright <testPath>"

2. To show the last run test report, use command

npx playwright show-report

3. To debug the code/test, use command

npx playwright test --debug

4. To generate the automation script and playback the scrpit, Use Codegen tool

npx playwright codegen <Url/Webste>

5. To debug API calls/logs

=> Add script in package.json
=> Press shift+ctrl+p
=> search "debug npm script" and run it.
=> it will degug all code of your test

6. To trace test logs

 - Run test which needs to be trace and it will create .zip file in "test-results" folder 
 - To see it on browser just run "https://trace.playwright.dev/" and select .zip file

 7. To use custom configuration file 
 - create custom configuration file
 - then run test against custom configuration file just append "--config <custom configuration file name>"

 8. To use tags in test
 - Add tags in test descriptions and run test by appending "--grep <tagname>"