import { User } from './models/User'

const user = new User({ id: 1 })

// // user.save()
user.on('change', () => {
    console.log('change', user)
})

user.fetch()
// user.events.trigger('change')
