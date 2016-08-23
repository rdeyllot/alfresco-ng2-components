#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#LINK CORE
echo "====== linking component: ng2-alfresco-core ====="
cd "$DIR/../../ng2-alfresco-core"
npm link
npm run typings
npm run build

echo "====== linking component: ng2-activiti-datatable ====="
cd "$DIR/../../ng2-alfresco-datatable"
npm link ng2-alfresco-core
npm link
npm run typings
npm run build

echo "====== linking component: ng2-activiti-form ====="
cd "$DIR/../../ng2-activiti-form"
npm link ng2-alfresco-core
npm link
npm run typings
npm run build

echo "====== linking component: ng2-activiti-tasklist ====="
cd "$DIR/.."
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-form
npm link
npm run typings
npm run build

cd $DIR
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-form
npm link ng2-activiti-tasklist

npm run clean
typings install
npm run build
