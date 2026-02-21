const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Check if user already exists
            const existingUser = User.findByEmail(email);
            if (existingUser) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Save user
            const newUser = User.createUser({
                username,
                email,
                password: hashedPassword,
            });

            // Generate JWT
            const payload = { user: { id: newUser.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "7d" },
                (err, token) => {
                    if (err) throw err;
                    console.log(`✅ User registered: ${email}`);
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error("Registration error:", err.message);
            res.status(500).json({ errors: [{ msg: "Server error" }] });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = User.findByEmail(email);

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "7d" },
                (err, token) => {
                    if (err) throw err;
                    console.log(`✅ User logged in: ${email}`);
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error("Login error:", err.message);
            res.status(500).json({ errors: [{ msg: "Server error" }] });
        }
    }
);

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get("/me", auth, (req, res) => {
    try {
        const user = User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (err) {
        console.error("Auth/me error:", err.message);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
