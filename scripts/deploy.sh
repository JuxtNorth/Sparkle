#!/bin/shift

npm run format

if npm run lint | grep -w 'warning\|error'; then
    echo "Abort"
    echo "Fix errors before deployment"
    # exit executing the script
    # return
  fi
    npm run build
    echo "Build complete, Showing preview"
    npm run preview 