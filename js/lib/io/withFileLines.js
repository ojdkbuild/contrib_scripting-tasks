/*
 * Copyright 2020, akashche at redhat.com
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
], function() {
    "use strict";

    var BufferedReader = Packages.java.io.BufferedReader;
    var FileInputStream = Packages.java.io.FileInputStream;
    var InputStreamReader = Packages.java.io.InputStreamReader;

    return function(path, fun) {
        var fis = new FileInputStream(path);
        try {
            var reader = new BufferedReader(new InputStreamReader(fis, "UTF-8"));
            var st = null;
            while (null !== (st = reader.readLine())) {
                fun(String(st));
            }
        } finally {
            fis.close();
        }
    };

});
