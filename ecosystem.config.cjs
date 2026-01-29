module.exports = {
    apps: [{
        name: 'gotruck-frontend',
        script: 'npm',
        args: 'run preview -- --port 5173 --host',
        cwd: '/var/www/gotruck-frontend',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production'
        }
    }]
}
