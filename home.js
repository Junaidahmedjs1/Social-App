import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs, Timestamp, query, orderBy, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const form = document.querySelector('#form');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const cardContainer = document.querySelector('#card');
const logOutButton = document.querySelector('#logout-btn');

let posts = []; // Store posts in this array for easier manipulation

// Initialize Firebase Auth state change listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`User logged in with UID: ${user.uid}`);
    } else {
        window.location = 'index.html';
    }
});

// User Logout functionality
logOutButton.addEventListener('click', handleLogout);

// Fetch and display posts from Firestore
async function fetchPosts() {
    posts.length = 0; // Clear the current posts array
    try {
        const postsQuery = query(collection(db, "posts"), orderBy("postDate", "desc"));
        const querySnapshot = await getDocs(postsQuery);
        
        querySnapshot.forEach(docSnapshot => {
            posts.push({ ...docSnapshot.data(), docId: docSnapshot.id });
        });
        
        renderPosts(); // Render posts after fetching
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }
}

// Render posts on the page
function renderPosts() {
    cardContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        cardContainer.innerHTML += createPostCard(post);
    });

    // Attach event listeners to dynamically created buttons
    attachEventListeners();
}

// Create a card HTML for a post
function createPostCard(post) {
    return `
        <div class="card mt-2" data-doc-id="${post.docId}">
            <div class="card-body">
                <p class="fs-5"><span class="h4 fw-bold">Title:</span> ${post.title}</p>
                <p class="fs-5"><span class="h5 fw-bold">Description:</span> ${post.description}</p>
                <button type="button" class="fw-bold btn btn-danger delete-btn">Delete</button>
                <button type="button" class="fw-bold btn btn-info update-btn">Update</button>
            </div>
        </div>`;
}

// Attach event listeners for delete and update buttons
function attachEventListeners() {
    const deleteButtons = cardContainer.querySelectorAll('.delete-btn');
    const updateButtons = cardContainer.querySelectorAll('.update-btn');

    deleteButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleDeletePost(index));
    });

    updateButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleUpdatePost(index));
    });
}

// Handle post deletion
async function handleDeletePost(index) {
    const postId = posts[index].docId;
    try {
        await deleteDoc(doc(db, "posts", postId)); // Delete from Firestore
        posts.splice(index, 1); // Remove from local array
        renderPosts(); // Re-render the updated list
        console.log("Post deleted successfully");
    } catch (error) {
        console.error("Error deleting post: ", error);
    }
}

// Handle post update
async function handleUpdatePost(index) {
    const updatedTitle = prompt('Enter new Title', posts[index].title);
    const updatedDescription = prompt('Enter new Description', posts[index].description);

    if (updatedTitle && updatedDescription) {
        try {
            await updateDoc(doc(db, "posts", posts[index].docId), {
                title: updatedTitle,
                description: updatedDescription
            });

            // Update post in the local array
            posts[index].title = updatedTitle;
            posts[index].description = updatedDescription;

            renderPosts(); // Re-render the updated list
            console.log("Post updated successfully");
        } catch (error) {
            console.error("Error updating post: ", error);
        }
    }
}

// Handle form submission to add new post
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = titleInput.value;
    const description = descriptionInput.value;

    try {
        const docRef = await addDoc(collection(db, "posts"), {
            title,
            description,
            uid: auth.currentUser.uid,
            postDate: Timestamp.fromDate(new Date())
        });

        console.log(`New post added with ID: ${docRef.id}`);
        fetchPosts(); // Refresh the posts list after adding a new post
    } catch (error) {
        console.error("Error adding new post: ", error);
    }
});

// Handle user logout
async function handleLogout() {
    try {
        await signOut(auth);
        alert('Logout successful');
        window.location = 'index.html';
    } catch (error) {
        console.error("Error during logout: ", error);
    }
}

// Initial call to fetch posts
fetchPosts();
