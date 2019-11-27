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

define([
    "./isNil",
    "./map"
], function(isNil, map) {
    "use strict";

    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    return function(root, dir) {

        if (isNil(dir)) {
            dir = root;
        }

        var rootPath = Paths.get(root);
        var dirPath = Paths.get(dir);

        var list = [];
        var ds = Files.newDirectoryStream(dirPath);
        try {
            var iter = ds.iterator();
            while (iter.hasNext()) {
                var pa = iter.next();
                list.push(rootPath.relativize(pa.toAbsolutePath()));
            }
        } finally {
            ds.close();
        }

        list.sort(function(a, b) {
            if (Files.isDirectory(a) && !Files.isDirectory(b)) {
                return -1;
            }
            if (!Files.isDirectory(a) && Files.isDirectory(b)) {
                return 1;
            }
            return a.compareTo(b);
        });

        return map(list, function(pa) {
            return String(pa.toString());
        });
    };

});
