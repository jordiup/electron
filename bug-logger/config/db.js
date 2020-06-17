const mongoose = require('mongoose');

require('dotenv').config({
    path: `.env.${process.env.NODE_ENV}`
});

// console.log(process.env.MONGO_DB_PASSWORD)

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://jordi1234:${process.env.MONGO_DB_PASSWORD}@jordiscluster-xu5sy.mongodb.net/<dbname>?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: false
            }
        )
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB