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
    "lib/common/appdir",
], function(appdir) {
    "use strict";

    var System = Packages.java.lang.System;
    var ProcessBuilder = Packages.java.lang.ProcessBuilder;
    var File = Packages.java.io.File;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;

    var excludes = [
        "Compiler.compiler",
        //"Compiler.sunflow",
        //"Compress.test",
        "CryptoAes.test",
        //"CryptoRsa.test",
        //"CryptoSignVerify.test",
        "Derby.test",
        //"MpegAudio.test",
        "ScimarkFFT.large",
        //"ScimarkFFT.small",
        "ScimarkLU.large",
        //"ScimarkLU.small",
        //"ScimarkMonteCarlo.test",
        "ScimarkSOR.large",
        //"ScimarkSOR.small",
        "ScimarkSparse.large",
        "ScimarkSparse.small"
        //"Serial.test",
        //"Sunflow.test",
        //"XmlTransform.test",
        //"XmlValidation.test"
    ];

    return function(javaHome, specjvmJar, resultsFile, mock) {
        var jcPath = Paths.get(specjvmJar);
        if (!(Files.exists(jcPath) && Files.isRegularFile(jcPath)) && (true !== mock)) {
            throw new Error("Invalid 'specjvm.jar' file specified, path: [" + jcPath.toAbsolutePath() + "]");
        }
        var javaExe = javaHome + "/bin/java.exe";
        var javaPath = Paths.get(javaExe);
        if (!(Files.exists(javaPath) && Files.isRegularFile(javaPath)) && (true !== mock)) {
            throw new Error("Invalid 'javaHome' parameter specified, path: [" + javaPath.toAbsolutePath() + "]");
        }
        var excludesRegex = "\"(" + excludes.join("|") + ")\"";

        if (true !== mock) {
            return new ProcessBuilder(
                    javaExe,
                    "-jar", specjvmJar,
                    "-t", "4",
                    "-e", excludesRegex
                    ).redirectOutput(new File(resultsFile)).start().waitFor();
        } else {
            var mockSrc = Paths.get(appdir + "js/test/data/specjvm_results.txt");
            var mockDest = Paths.get(resultsFile);
            Files.copy(mockSrc, mockDest);
            return 0;
        }
    };

});
