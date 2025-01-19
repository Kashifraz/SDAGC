package com.example.qrazyqrsrus;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.common.base.Verify;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.storage.FileDownloadTask;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;



public class FirebaseFirestoreTest{
    //our test instance to spy on
    FirebaseDB firebaseDBSpy;
    //mocking our dependencies

    @Mock
    FirebaseFirestore mockFirestore = Mockito.mock(FirebaseFirestore.class);

    @Mock
    FirebaseStorage mockFirebaseStorage = Mockito.mock(FirebaseStorage.class);

    @Mock
    FirebaseMessaging mockFirebaseMessaging = Mockito.mock(FirebaseMessaging.class);

    @Mock
    StorageReference mockStorageReference = Mockito.mock(StorageReference.class);

    @Mock
    CollectionReference mockUserCollection = Mockito.mock(CollectionReference.class);

    @Mock
    CollectionReference mockEventsCollection = Mockito.mock(CollectionReference.class);

    @Mock
    DocumentReference mockDocumentReference = Mockito.mock(DocumentReference.class);

    @Mock
    Query mockQuery = Mockito.mock(Query.class);

    @Mock
    Iterator<QueryDocumentSnapshot> mockIterator = Mockito.mock(Iterator.class);

    @Mock
    QuerySnapshot mockQuerySnapshot = Mockito.mock(QuerySnapshot.class);

    @Mock
    DocumentSnapshot mockDocumentSnapshot = Mockito.mock(DocumentSnapshot.class);
    @Mock
    DocumentSnapshot mockDocumentSnapshot2 = Mockito.mock(DocumentSnapshot.class);
    @Mock
    DocumentSnapshot mockDocumentSnapshot3 = Mockito.mock(DocumentSnapshot.class);

    @Mock
    QueryDocumentSnapshot mockQueryDocumentSnapshot = Mockito.mock(QueryDocumentSnapshot.class);

    @Mock
    UploadTask.TaskSnapshot mockTaskSnapshot = Mockito.mock(UploadTask.TaskSnapshot.class);

    @Mock
    FileDownloadTask.TaskSnapshot mockDownloadTaskSnapshot = Mockito.mock(FileDownloadTask.TaskSnapshot.class);

    @Mock
    Task<DocumentReference> mockTask = (Task<DocumentReference>) Mockito.mock(Task.class);

    @Mock
    Task<Void> mockTaskVoid = (Task<Void>) Mockito.mock(Task.class);

    @Mock
    Task<QuerySnapshot> mockTaskQuery = (Task<QuerySnapshot>) Mockito.mock(Task.class);

    @Mock
    UploadTask mockUploadTask = Mockito.mock(UploadTask.class);

    @Mock
    FileDownloadTask mockFileDownloadTask = Mockito.mock(FileDownloadTask.class);

    @Mock
    Void mockVoid = Mockito.mock(Void.class);

//    @InjectMocks
//    FirebaseDB firebaseDB;

    List<DocumentSnapshot> mockList = new ArrayList<DocumentSnapshot>();

    @Before
    public void setUp() {


        //we set up Task<Query> to return our mockQuerySnapshot object
        when(mockQuery.get()).thenReturn(mockTaskQuery);
        when(mockTaskQuery.getResult()).thenReturn(mockQuerySnapshot);
        when(mockQuerySnapshot.getDocuments()).thenReturn(mockList);

        //setting up the mock iterator that is used by QuerySnapshots was made possible thanks to the help of ChatGPT
        //OpenAI, 2024, ChatGPT, QuerySnapshot iterator mocking
        when(mockQuerySnapshot.iterator()).thenReturn(mockIterator);

        //we set up the firestore instance to return our mock collections
        when(mockFirestore.collection("Users")).thenReturn(mockUserCollection);
        when(mockFirestore.collection("Events")).thenReturn(mockEventsCollection);
        //we set up our mock collections to return our mockTask objects when we try to interact with them
        when(mockUserCollection.add(Mockito.any())).thenReturn(mockTask);
        when(mockEventsCollection.add(Mockito.any())).thenReturn(mockTask);

        //we set up the mock storage instance to return a storage reference
        when(mockFirebaseStorage.getReference()).thenReturn(mockStorageReference);
        when(mockFirebaseStorage.getReference(Mockito.any())).thenReturn(mockStorageReference);

        //we set up the storage reference to return a Task that we can attach onSuccessListeners to
        when(mockStorageReference.putFile(Mockito.any())).thenReturn(mockUploadTask);
        when(mockStorageReference.child(Mockito.any())).thenReturn(mockStorageReference);
        when(mockStorageReference.getFile((File) Mockito.any())).thenReturn(mockFileDownloadTask);

        //setting up the onSuccess listeners was made possible thanks to the help of ChatGPT
        //OpenAI, 2024, ChatGPT, Firebase Firestore mock Task onSuccess/onComplete Listeners
        when(mockTask.addOnSuccessListener(Mockito.any())).thenAnswer(invocation -> {
            // Get the onSuccess listener
            OnSuccessListener<DocumentReference> listener = invocation.getArgument(0);
            // Call the onSuccess method with a mock DocumentReference
            listener.onSuccess(mockDocumentReference);
            return mockTask;
        });
        when(mockTaskVoid.addOnSuccessListener(Mockito.any())).thenAnswer(invocation -> {
            // Get the onSuccess listener
            OnSuccessListener<Void> listener = invocation.getArgument(0);
            // Call the onSuccess method with a mock DocumentReference
            listener.onSuccess(mockVoid);
            return mockTaskVoid;
        });
        when(mockTaskQuery.addOnCompleteListener(Mockito.any())).thenAnswer(invocation -> {
            // Get the onSuccess listener
            OnCompleteListener<QuerySnapshot> listener = invocation.getArgument(0);
            // Call the onSuccess method with a mock DocumentReference
            listener.onComplete(mockTaskQuery);
            return mockTaskQuery;
        });
        when(mockUploadTask.addOnSuccessListener(Mockito.any())).thenAnswer(invocation -> {
            // Get the onSuccess listener
            OnSuccessListener<UploadTask.TaskSnapshot> listener = invocation.getArgument(0);
            // Call the onSuccess method with a mock DocumentReference
            listener.onSuccess(mockTaskSnapshot);
            return mockUploadTask;
        });
        when(mockFileDownloadTask.addOnSuccessListener(Mockito.any())).thenAnswer(invocation -> {
            // Get the onSuccess listener
            OnSuccessListener<FileDownloadTask.TaskSnapshot> listener = invocation.getArgument(0);
            // Call the onSuccess method with a mock DocumentReference
            listener.onSuccess(mockDownloadTaskSnapshot);
            return mockFileDownloadTask;
        });

        //we first create a partial mock of the FirebaseDB class, with mock instances of Firestore, FirebaseStorage, and FirebaseMessaging
        firebaseDBSpy = Mockito.spy(FirebaseDB.getInstance(mockFirestore, mockFirebaseStorage, mockFirebaseMessaging));
    }

    //this test was written with the help of ChatGPT
    //OpenAI, 2024, ChatGPT, Unit Tests for Singleton classes using Mockito
    @Test
    public void testAddUser_Success() {

        when(mockDocumentReference.update("name", "john t",
                "email", "testEmail",
                "geolocationOn", false,
                "profilePicturePath", "testPath", "documentId", "testDocumentId")).thenReturn(mockTaskVoid);
        // Mock Firestore behavior
//        when(mockFirestore.collection("Users")).thenReturn(mockUserCollection);

        // Create sample Attendee object
        Attendee user = new Attendee("testId", null, "john t", "testEmail", "testPath", false);

        when(mockDocumentReference.getId()).thenReturn("testDocumentId");
        when(mockUserCollection.document("testDocumentId")).thenReturn(mockDocumentReference);
        // Call method to be tested
        firebaseDBSpy.addUser(user);

        //we verify that the functions should be called upon a successful addition of a user to firestore are called
        verify(mockFirestore, Mockito.times(1)).collection("Users");
        verify(mockUserCollection, Mockito.times(1)).add(user);
        verify(mockUserCollection, Mockito.times(1)).document("testDocumentId");
        verify(mockDocumentReference, Mockito.times(1)).update("name", "john t",
                "email", "testEmail",
                "geolocationOn", false,
                "profilePicturePath", "testPath", "documentId", "testDocumentId");
    }



    @Test
    public void testLoginUser_AlreadyExists(){
        Attendee user = new Attendee("coolId", "1234", "john again", "testEmail", "testPath", false);

        mockList.add(mockDocumentSnapshot);
        //our mock assumes there is one document in the database with a matching id
        when(mockUserCollection.whereEqualTo("id", "coolId")).thenReturn(mockQuery);
        when(mockTaskQuery.isSuccessful()).thenReturn(true);
        //when user already exists, task.getResult should return a document snapshot

        when(mockQuerySnapshot.isEmpty()).thenReturn(false);

        //we create a mock list of documentSnapshots for our query to return


        when(mockQueryDocumentSnapshot.toObject(Attendee.class)).thenReturn(user);
        when(mockQueryDocumentSnapshot.getId()).thenReturn("1234");

        //we configure the mockIterator to have only one element, and return our single user
        when(mockIterator.hasNext()).thenReturn(true, false);
        when(mockIterator.next()).thenReturn(mockQueryDocumentSnapshot);

        //we provide a callback that we will capture the arguments of, to make sure the right attendee is being retrieved
        ArgumentCaptor<Attendee> attendeeCaptor = ArgumentCaptor.forClass(Attendee.class);
        FirebaseDB.GetAttendeeCallBack mockCallback = Mockito.mock(FirebaseDB.GetAttendeeCallBack.class);


        doNothing().when(firebaseDBSpy).addUser(Mockito.any());

        firebaseDBSpy.loginUser("coolId", mockCallback);

        verify(mockCallback).onResult(attendeeCaptor.capture());
        assertEquals(user, attendeeCaptor.getValue());
    }

    @Test
    public void testLoginUser_DoesNotExist(){
        Attendee newUser = new Attendee("boboblahblah");

        //when a user with the android ID "boboblahblah" tries to login, but they do not have a document in firebase yet, we should create a new one for them
        when(mockUserCollection.whereEqualTo("id", "boboblahblah")).thenReturn(mockQuery);
        when(mockTaskQuery.isSuccessful()).thenReturn(true);
        //when user already exists, task.getResult should return a document snapshot

        //no matching documents with android id boboblahblah
        when(mockQuerySnapshot.isEmpty()).thenReturn(true);

        //we provide a callback that we will capture the arguments of, to make sure the right attendee is being retrieved
        ArgumentCaptor<Attendee> attendeeCaptor = ArgumentCaptor.forClass(Attendee.class);
        FirebaseDB.GetAttendeeCallBack mockCallback = Mockito.mock(FirebaseDB.GetAttendeeCallBack.class);

        doNothing().when(firebaseDBSpy).addUser(Mockito.any());

        firebaseDBSpy.loginUser("boboblahblah", mockCallback);

        verify(mockCallback).onResult(attendeeCaptor.capture());
        assertEquals("Guest24", attendeeCaptor.getValue().getName());
        assertEquals("boboblahblah", attendeeCaptor.getValue().getId());
        assertEquals(false, attendeeCaptor.getValue().getGeolocationOn());
    }

    @Test
    public void testAddEvent_Success() {
        ArrayList<String> announcements = new ArrayList<String>();
        ArrayList<String> signUps = new ArrayList<String>();
        ArrayList<String> checkIns = new ArrayList<String>();

        Event event = new Event(null, "crazy event", "crazy organizer id", "crazy details",
                "crazy location", "crazy start time", "crazy end time", (Boolean) false, "crazy path", "crazy code", "crazy promo code", "crazy token"
                , announcements, signUps, checkIns, 22);

        //we want the document reference to behave some way, for example to generate a document id of crazyId
        when(mockDocumentReference.getId()).thenReturn("crazyId");
        when(mockEventsCollection.document("crazyId")).thenReturn(mockDocumentReference);
        when(mockDocumentReference.update("announcements", announcements,
                "checkIns", checkIns, "signUps",
                signUps, "posterPath", "crazy path",
                "qrCode", "crazy code", "documentId", "crazyId",
                "organizerToken", "crazy token")).thenReturn(mockTaskVoid);

        firebaseDBSpy.addEvent(event);

        //we verify that the functions should be called upon a successful addition of a user to firestore are called
        verify(mockFirestore, Mockito.times(1)).collection("Events");
        verify(mockEventsCollection, Mockito.times(1)).add(event);
        verify(mockEventsCollection, Mockito.times(1)).document("crazyId");
        //verify that the field that can change are updated to what they should be
        verify(mockDocumentReference, Mockito.times(1)).update("announcements", announcements,
                "checkIns", checkIns, "signUps",
                signUps, "posterPath", "crazy path",
                "qrCode", "crazy code", "documentId", "crazyId",
                "organizerToken", "crazy token");
    }

    @Test
    public void testUploadImage(){
        //this test is fairly boring, everything is left to firebase

        String pathName = "picture_path_name";
        Uri mockUri = Mockito.mock(Uri.class);



        firebaseDBSpy.uploadImage(mockUri, pathName);

        //we verify that an onsuccesslistener is added
        verify(mockUploadTask).addOnSuccessListener(Mockito.any());
        verify(mockUploadTask).addOnFailureListener(Mockito.any());
    }


//    @PrepareForTest(BitmapFactory.class)
    @Test
    public void testRetrieveImage_Attendee(){
        Attendee testAttendee = new Attendee("4321", "1234", "johnny t", "email", "profile/my_crazy_profile_pic", true);

        Bitmap testBitmap = Mockito.mock(Bitmap.class);

        ArgumentCaptor<File> localFileCaptor = ArgumentCaptor.forClass(File.class);

        FirebaseDB.GetBitmapCallBack mockCallback = Mockito.mock(FirebaseDB.GetBitmapCallBack.class);

//        PowerMockito.mockStatic(BitmapFactory.class);
//        when(BitmapFactory.decodeFile(Mockito.any())).thenReturn(testBitmap);

        try (MockedStatic<BitmapFactory> mockedFactory = Mockito.mockStatic(BitmapFactory.class)){
            mockedFactory.when(() -> BitmapFactory.decodeFile(Mockito.any()))
                    .thenReturn(testBitmap);
        }

        firebaseDBSpy.retrieveImage(testAttendee, mockCallback);

        verify(mockStorageReference).getFile(localFileCaptor.capture());

        assertEquals("my_crazy_profile_pic.jpg", localFileCaptor.getValue().getPath());
        verify(mockFileDownloadTask).addOnSuccessListener(Mockito.any());
        verify(mockFileDownloadTask).addOnFailureListener(Mockito.any());

        verify(mockCallback).onResult(Mockito.any());
    }
}
