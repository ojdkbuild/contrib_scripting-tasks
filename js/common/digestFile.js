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
    "./hexBytes"
], function(hexBytes) {
    "use strict";

    var JArray = Packages.java.lang.reflect.Array;
    var Byte = Packages.java.lang.Byte;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;
    var StandardOpenOption = Packages.java.nio.file.StandardOpenOption;
    var MessageDigest = Packages.java.security.MessageDigest;

    return function(file, algorithm) {
        var path = Paths.get(file);
        if (!(Files.exists(path) && Files.isRegularFile(path))) {
            throw new Error("Specified file does not exist, path: [" + path.toAbsolutePath() + "]");
        }

        var buf = JArray.newInstance(Byte.TYPE, 4096);
        var md = MessageDigest.getInstance(algorithm);

        var is = Files.newInputStream(path, StandardOpenOption.READ);
        var read = 0;
        try {
            while (-1 !== (read = is.read(buf))) {
                md.update(buf, 0, read);
            }
        } finally {
            is.close();
        }

        var bytes = md.digest();

        return hexBytes(bytes);
    };

});