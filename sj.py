__author__ = "Seweryn Jagusiak"

import json
import re
import sys
import os
from pprint import pprint
from collections import OrderedDict

print("SJ Manager v.0.0.1\nauthor: Seweryn Jagusiak\nsite: https://github.com/jagusiak/sj.js\n\n")

appName = 'app'
action = 'help'

if len(sys.argv) > 1:
    action = sys.argv[1]

if len(sys.argv) > 2:
    appName = sys.argv[2]


def merge():

    # load settings
    def loadSettings():
        global appName

        def mergeDict(merged, local) :
            for key in local:
                element = local[key]
                if key in merged and type(element) is OrderedDict:
                    mergeDict(merged[key], element)
                else:
                    merged[key] = element

        with open('sj/settings.json') as data_file:
            settingsData = json.load(data_file, object_pairs_hook=OrderedDict)

        with open(appName + '/settings.json') as data_file:
            mergeDict(settingsData, json.load(data_file, object_pairs_hook=OrderedDict))

        return settingsData

    def loadMain():
        with open('sj.js', 'r') as data_file:
            content = data_file.read()
        return content

    def splitMain(main):
        return (main[0:main.find('//<-- INIT START')], main[(main.find('//--> INIT STOP')+15):])

    def makeSettings(settings):
        return 'window.SJ.settings = ' + json.dumps(settings) + ";\n"

    def getConfig(scope, file):
        global appName
        if scope == "APP" :
            with open(appName + '/config/' + file + '.json') as data_file:
                return json.load(data_file, object_pairs_hook=OrderedDict)
        elif scope == "FULL" :
            try:
                with open(appName + '/config/' + file + '.json') as data_file:
                    data = json.load(data_file, object_pairs_hook=OrderedDict)
                    if len(data) == 0:
                        raise Exception("Empty config")
                    return data
            except Exception:
                with open('sj/config/' + file + '.json') as data_file:
                    return json.load(data_file, object_pairs_hook=OrderedDict)
        else:
            with open('sj/config/' + file + '.json') as data_file:
                return json.load(data_file)


    def makeConfig(settings):
        config = {}
        for name in settings['configuration']:
            data = settings['configuration'][name]
            config[name] = getConfig(data['scope'], data['file'])

        return "window.SJ.config = (function(configuration) {var data = configuration; return function(name, item) {return data[name][item]; };}(" + json.dumps(config) + "));\n"

    def makeModules(settings):
        global appName
        modules = ["window.SJ.module = function(name, code) { if (!window.SJ.settings.modules[name]) {console.error('Module ' + name + ' not found in settings');} if (window.SJ[name]) {console.error('Cannot reserve name ' + name);} window.SJ[name] = code(window.SJ);};"];
        for name in settings["modules"]:
            module = settings["modules"][name].replace('APP_NAME', appName)
            with open(module + '.js') as data_file:
                modules.append(data_file.read().replace('"use strict";', ''))
            print("Loaded module: " + name)
        return "\n".join(modules)

    def makeRun(settings):
        return "setTimeout(window.SJ[window.SJ.settings.init.module][window.SJ.settings.init.action], 1);\n";

    settings = loadSettings()

    print("Loaded settings")

    (start, stop) = splitMain(loadMain())

    print("Loaded core file")

    f = open('sj-' + appName + '-m.js','w')
    f.write(start)
    f.write(makeSettings(settings))
    print("Loaded core settings")
    f.write(makeConfig(settings))
    print("Loaded core config")
    f.write(makeModules(settings))
    print("Loaded core modules")
    f.write(makeRun(settings))
    print("Loaded core run")
    f.write(stop)
    f.close()

    print("Finished, see sj-" + appName + "-m.js")

def new():
    global appName

    def createFile(path, data):
        file = open(path, "w")
        file.write(json.dumps(data))
        file.close()

    if os.path.isdir(appName):
        print("Directory " + appName + " already exists!")
    else:
        os.makedirs(appName)
        print("Created directory: " + appName)
        os.makedirs(appName + '/config')
        print("Created directory: " + appName + '/conifg')
        os.makedirs(appName + '/modules')
        print("Created directory: " + appName + '/modules')

        createFile(appName + '/settings.json', {'configuration':{}, 'modules' :{}, 'init' : {}})
        print("Created file: " + appName + appName + '/settings.json')

        for config in ['canvas', 'sound', 'texture']:
            createFile(appName + '/config/' + config + '.json', {})
            print("Created file: " + appName + '/config/' + config + '.json')

def help():
    print("Commands:\n\tpython sj.py new [appName]\n\tCreates new app structure in directory appName, default appName='app'/\n\n\tpython sj.py merge [appName]\n\tConcatenates all files and creates sj-m.js for appName, default appName='app'")

if action == 'merge':
    merge()
elif action == 'new':
    new()
elif action == 'help':
    help()
else:
    print('Action ' + action + ' not recognised, use help\n\n')
    help()
