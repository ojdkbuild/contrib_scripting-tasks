/*
 * Copyright 2019, akashche at redhat.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
    // get app directory
    var appdir = function() {
        var clazz = Packages.java.lang.Class.forName("org.mozilla.javascript.tools.shell.Main");
        var uri = clazz.getProtectionDomain().getCodeSource().getLocation().toURI();
        var file = new Packages.java.io.File(uri);
        var badslashPath = String(file.getParentFile().getParentFile().getAbsolutePath());
        return badslashPath.replace(/\\/g, "/");
    } ();

    load(appdir  + "/init/requireConfig.js");
    requireConfig(appdir);

    // get task name and args
    var argline = String(arguments[0]).trim();
    var input = function() {
        if (-1 !== argline.indexOf(" ")) {
            var splitted = argline.split(" ");
            var task = splitted[0];
            splitted.shift();
            return {
                task: task,
                args: splitted
            };
        } else {
            return {
                task: argline,
                args: []
            };
        }
    } ();

    // load and run specified task
    require(["tasks/" + input.task], function(mod) {
        if ("function" === typeof(mod)) {
            mod.apply(null, input.args);
        } else {
            print("ERROR: invalid task," +
                    " name: [" + input.task + "]");
        }
    });

} (arguments));
