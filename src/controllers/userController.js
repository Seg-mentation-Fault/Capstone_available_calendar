const createUser = async (storage, attributes, t) => {
  try {
    //  checks if the user exits by email
    let user = await storage.user.findOne({
      where: { email: attributes.email },
    });
    if (user === null) {
      user = await storage.createRecord(
        'User',
        {
          firstName: attributes.firstName,
          lastName: attributes.lastName,
          email: attributes.email,
        },
        t
      );
    }
    return user;
  } catch (err) {
    throw err;
  }
};

exports.createUser = createUser;
