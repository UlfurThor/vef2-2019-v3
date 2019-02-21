INSERT INTO applications (name, email, phone, comment, jobTitle, processed)
VALUES ('Jón Jónsson', 'jon@example.org', '1231231', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut bibendum eleifend odio, eu laoreet sapien sollicitudin quis.', 'programer', false);
INSERT INTO applications (name, email, phone, comment, jobTitle, processed)
VALUES ('Guðmundur Guðmundsson', 'gummi@example.org', '1233211', 'Nam a sapien tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus tincidunt ante nisl, eu placerat arcu porttitor mollis. Duis porttitor dolor vitae aliquet sollicitudin. Etiam scelerisque, lorem eu varius eleifend, elit diam facilisis leo, sit amet volutpat est enim eu tortor. Mauris non tortor eget nibh fermentum maximus vel sit amet ante. Vestibulum condimentum facilisis nisl eget interdum. Donec vel cursus purus.', 'programer', true);
INSERT INTO applications (name, email, phone, comment, jobTitle, processed)
VALUES ('Anna Önnudóttir', 'anna@example.org', '3333333', 'Sed in sem sagittis, fringilla justo eget, vulputate nunc. Cras pharetra faucibus blandit. Sed non porta ligula, non efficitur dolor.', 'programer', false);
INSERT INTO applications (name, email, phone, comment, jobTitle, processed)
VALUES ('Guðmunda Guðmundsdóttir', 'gudmunda@example.org', '1111111', 'Aenean a nibh a enim cursus bibendum. Donec dictum velit in odio feugiat imperdiet. Sed blandit, justo vitae lacinia efficitur, tortor ante ultrices orci, nec placerat dui purus ac augue. Nullam aliquet purus sit amet erat laoreet, nec consequat augue suscipit. Curabitur rutrum pretium erat sed pellentesque. Proin ligula massa, varius id tristique in, varius id elit. Sed congue volutpat fringilla.', 'designer', false);
INSERT INTO applications (name, email, phone, comment, jobTitle, processed)
VALUES ('John Johnson', 'john@example.org', '1000000', 'Etiam accumsan neque nec mauris fringilla, id dignissim tortor maximus. Proin sit amet sodales felis. Vivamus ut est magna. Quisque porta quam ac orci dignissim convallis. Nunc efficitur sagittis felis at gravida. Praesent quis quam molestie, rutrum mi sed, malesuada nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis tortor, imperdiet in metus eget, bibendum aliquet nisl.', 'admin', false);
INSERT INTO applications (name, email, phone, comment, jobTitle, processed, deleted)
VALUES ('John Johnson', 'john@example.org', '1000000', 'Etiam accumsan neque nec mauris fringilla, id dignissim tortor maximus. Proin sit amet sodales felis. Vivamus ut est magna. Quisque porta quam ac orci dignissim convallis. Nunc efficitur sagittis felis at gravida. Praesent quis quam molestie, rutrum mi sed, malesuada nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse felis tortor, imperdiet in metus eget, bibendum aliquet nisl.', 'admin', false, current_timestamp);


INSERT INTO users (username, password, name, email, admin
,passwordplain --TODO REMOVE
)
VALUES ('admin', '$2b$11$mR5xCawElD6/494S3ozvB.dHAPrPPD6KQOtocRg8hLP9Lvi3vX17W','Admin', 'admin@example.org', true
,'asdfasdf' --TODO REMOVE
);


INSERT INTO users (username, password, name, email
,passwordplain --TODO REMOVE
)
VALUES ('nn', '$2b$11$7V7mJLNzt.24VuuUFXqIaO7xpjeI8Gjw7sJmz5UYadvMWHyImwGOO', 'Nafnlaus', 'nn@example.org'
,'12341234' --TODO REMOVE
);

