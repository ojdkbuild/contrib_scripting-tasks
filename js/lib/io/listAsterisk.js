/*
 * Copyright 2021, akashche at redhat.com
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

define([
    "../common/endsWith",
    "../common/filter",
    "../common/map",
    "../common/startsWith",
    "./listDirectory"
], function(endsWith, filter, map, startsWith, listDirectory) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    function fileName(file) {
        var partsForward = file.split("/");
        var partsBackward = partsForward[partsForward.length - 1].split("\\");
        return partsBackward[partsBackward.length - 1];
    }

    return function(file) {
        var name = fileName(file);
        if (!startsWith(name, "*")) {
            return [file];
        }
        var tail = name.substring(1);
        var path = Paths.get(file.replace(/\*/, "_"));
        var dir = path.toAbsolutePath().getParent().toString();
        var list = listDirectory(dir);
        var filtered = filter(list, function(fi) {
            return endsWith(fi, tail);
        });
        return map(filtered, function(fi) {
            return String(Paths.get(dir, fi).toString());
        });
    }
});