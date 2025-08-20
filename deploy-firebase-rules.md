# Firebase Security Rules Deployment

## 🔧 To Fix the Permission Issues:

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init firestore
   ```
   - Select your project: `vibe-sona`
   - Use existing rules: `firestore.rules`
   - Use existing indexes: `firestore.indexes.json`

4. **Deploy the security rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Manual Update via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `vibe-sona`
3. Go to **Firestore Database** → **Rules**
4. Replace the current rules with the content from `firestore.rules`
5. Click **Publish**

### Option 3: Quick Fix - Temporary Rules

If you need a quick fix, use these temporary rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **Note**: Option 3 allows all authenticated users to read/write all data. Use only for testing, then switch to the proper rules in `firestore.rules`.

## 🎯 What the Rules Do:

- **Users can only access their own data** (`/users/{userId}`)
- **Subcollections are protected** (submissions, stats, etc.)
- **Public read access** for playlists (if needed)
- **Default deny all** for security

## 🚀 After Deploying Rules:

1. **Refresh your app**
2. **Try submitting to playlists** - should work now
3. **Check user submissions** - should load properly
4. **Test user stats** - should save correctly

The permission errors should be resolved! 🎵
