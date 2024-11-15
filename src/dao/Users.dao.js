import userModel from "./models/User.js";


export default class Users {

    get = (params) =>{
        return userModel.find(params);
    }

    getBy = (params) =>{
       // return userModel.findById(params);
        return userModel.findOne(params); // Use findOne for querying by email or other fields

    }


    save = (doc) =>{
        return userModel.create(doc);
    }
    saveMany = (docs) =>{

        return userModel.insertMany(docs)
    }


    update = (id,doc) =>{
        return userModel.findByIdAndUpdate(id,{$set:doc})
    }

    delete = (id) =>{
        return userModel.findByIdAndDelete(id);
    }
}