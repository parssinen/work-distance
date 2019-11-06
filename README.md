## Work Distance

Add locations for automatic distance calculation.

## How to

- # Clone repository
`git clone https://github.com/parssinen/work-distance`
- insert your Goolge Maps Distance Matrix API key into [main.js line 36](https://github.com/parssinen/work-distance/blob/develop/main.js#L36)
- go to [extensions](chrome://extensions/)
- enable developer mode from upper right corner
- add this extension to chrome using "Load unpacked"-button
- set up locations:
    - Go to [extensions](chrome://extensions/)
    - Click "Details" for this extension
    - Select Extension options
    - Insert locations and click "Tallenna"

Now when you visit etuovi.com listings the extension will calculate distance and duration for all your locations and append that information as the first item in Basic Information.