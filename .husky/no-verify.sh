# short-circuit hooks if we're rebasing
BRANCH_NAME=$(git branch | grep '*' | sed 's/* //')
if [[ $BRANCH_NAME =~ "no branch" ]]; then
  echo "You are rebasing, skipping hooks"
  exit 0
fi