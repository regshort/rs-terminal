const { exec } = require('child_process');

// Run the first command
exec('npx prisma migrate deploy', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(stdout);
});

// Run the second command
exec('node server.js', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err}`);
    return;
  }
  console.log(stdout);
});