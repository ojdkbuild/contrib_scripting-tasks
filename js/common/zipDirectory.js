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
    "./copyBytes",
    "./isNil",
    "./listDirectory"
], function(copyBytes, isNil, listDirectory) {
    "use strict";

    var Charset = Packages.java.nio.charset.Charset;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;
    var StandardOpenOption = Packages.java.nio.file.StandardOpenOption;
    var ZipEntry = Packages.java.util.zip.ZipEntry;
    var ZipOutputStream = Packages.java.util.zip.ZipOutputStream;

    function walkAndZip(root, zos, dirPath) {
        var dirName = String(root.relativize(dirPath)).replace(/\\/g, "/") + "/";
        zos.putNextEntry(new ZipEntry(dirName));
        zos.closeEntry();
        var list = listDirectory(String(dirPath.toAbsolutePath()));
        list.forEach(function(en) {
            var pa = Paths.get(dirPath, en);
            if (Files.isDirectory(pa)) {
                walkAndZip(root, zos, pa);
            } else {
                var name = String(root.relativize(pa)).replace(/\\/g, "/");
                zos.putNextEntry(new ZipEntry(name));
                var is = Files.newInputStream(pa, StandardOpenOption.READ);
                try {
                    copyBytes(is, zos);
                } finally {
                    is.close();
                }
                zos.closeEntry();
            }
        });
    }

    return function(dir, level) {
        var dirPath = Paths.get(dir);
        if (!Files.isDirectory(dirPath)) {
            throw new Error("Invalid directory specified, path: [" + dirPath.toAbsolutePath() + "]");
        }
        var dest = Paths.get(dir.toString() + ".zip");
        if (Files.exists(dest)) {
            throw new Error("Destination ZIP file already exists, path: [" + dest.toAbsolutePath() + "]");
        }
        if (isNil(level)) {
            level = 9;
        }

        var root = dirPath.toAbsolutePath().getParent();
        var os = Files.newOutputStream(dest, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE);
        try {
            var zos = new ZipOutputStream(os, Charset.forName("UTF-8"));
            zos.setLevel(level);
            walkAndZip(root, zos, dirPath);
            zos.close();
        } finally {
            os.close();
        }

        return String(dest);
    };
});
