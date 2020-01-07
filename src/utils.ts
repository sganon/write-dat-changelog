import { exec } from 'child_process';

export function ExecPromise(command: string): Promise<string> {
    return new Promise(function(resolve, reject) {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            resolve(stdout.trim());
        });
    });
}
