<?php

namespace App\Http\Controllers;

use App\Models\Children;
use App\Models\DocumentFile;
use App\Models\ChildrenImmunization;
use App\Models\Measurement;
use App\Models\Immunization;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ChildrenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $children = Children::with('photo')->where('user_id', Auth::user()->id)->get();
        return Inertia::render('Dashboard/Children/Index', [
            "children" => $children
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Dashboard/Children/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "date_of_birth" => ["required", "date", "before:tomorrow"],
            "gender" => ["required", "in:laki-laki,perempuan"],
            "is_alergic" => ["required", "boolean"],
            "alergic_desc" => ["nullable", "string", "max:255"],
            "photo" => ["nullable", "image", "max:2048"],
            "blood_type" => ["nullable"],
            "user_id" => ["required", "exists:users,id", "integer"],
            // measurement
            "weight" => ["required", "numeric", "min:0"],
            "height" => ["required", "numeric", "min:0"],
            "head_circumference" => ["nullable", "numeric", "min:0"],
            "note" => ["nullable", "string", "max:255"],
            "date_of_measurement" => ["required", "date", "before:tomorrow"],
        ]);

        return DB::transaction(function () use ($validated) {
            if ($validated['photo'] != null) {
                $image = DocumentFile::createFile('public','/children',$validated["photo"]);
            }
            $children = Children::create([
                'name' => $validated['name'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'is_alergic' => $validated['is_alergic'],
                'alergic_desc' => $validated['alergic_desc'],
                'photo_id' => $image->id ?? null,
                'blood_type' => $validated['blood_type'],
                'user_id' => $validated['user_id']
            ]);

            // Pengukuran Pasca Kelahiran
            Measurement::create([
                'children_id' => $children->id,
                'date_of_measurement' => $validated['date_of_measurement'] ?? $validated['date_of_birth'],
                'height' => $validated['height'],
                'weight' => $validated['weight'],
                'head_circumference' => $validated['head_circumference'],
                'note' => $validated['note'],
                'is_birth_measurement' => true
            ]);

            $immunizations = Immunization::all();
            foreach ($immunizations as $immunization) {
                // We need to calculate the recommended date based on the date of birth and the recommended age
                // This was coded by Github Copilot so Proceed with caution
                //TODO : Fix this
                $recommended_date = date('Y-m-d', strtotime($children->date_of_birth . ' + ' . $immunization->recommended_days . ' days'));
                ChildrenImmunization::create([
                    'children_id' => $children->id,
                    'immunization_id' => $immunization->id,
                    'recommended_date' => $recommended_date,
                    'status' => 'belum',
                    'date_of_immunization' => null,
                    'note' => null
                ]);
            }

            // TODO:
            // 1. Change Return Route

            return redirect()->route('data-anak.index');
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function UserStore(Request $request)
    {
        //
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "date_of_birth" => ["required", "date", "before:tomorrow"],
            "gender" => ["required", "in:laki-laki,perempuan"],
            "is_alergic" => ["required", "boolean"],
            "alergic_desc" => ["nullable", "string", "max:255"],
            "photo" => ["nullable", "image", "max:2048"],
            "blood_type" => ["nullable", "in:-A,-B,-AB,-O,+A,+B,+AB,+O"],
            "user_id" => ["required", "exists:users,id", "integer"],
            // measurement
            "weight" => ["required", "numeric", "min:0"],
            "height" => ["required", "numeric", "min:0"],
            "head_circumference" => ["nullable", "numeric", "min:0"],
            "note" => ["nullable", "string", "max:255"],
            "date_of_measurement" => ["required", "date", "before:tomorrow"],
        ]);

        return DB::transaction(function () use ($validated) {
            if ($validated['photo'] != null) {
                $image = DocumentFile::createFile('public','/children',$validated["photo"]);
            }
            $children = Children::create([
                'name' => $validated['name'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'is_alergic' => $validated['is_alergic'],
                'alergic_desc' => $validated['alergic_desc'],
                'photo_id' => $image->id ?? null,
                'blood_type' => $validated['blood_type'],
                'user_id' => $validated['user_id']
            ]);

            // Pengukuran Pasca Kelahiran
            Measurement::create([
                'children_id' => $children->id,
                'date_of_measurement' => $validated['date_of_measurement'] ?? $validated['date_of_birth'],
                'height' => $validated['height'],
                'weight' => $validated['weight'],
                'head_circumference' => $validated['head_circumference'],
                'note' => $validated['note'],
                'is_birth_measurement' => true
            ]);

            $immunizations = Immunization::all();
            foreach ($immunizations as $immunization) {
                // We need to calculate the recommended date based on the date of birth and the recommended age
                // This was coded by Github Copilot so Proceed with caution
                //TODO : Fix this
                $recommended_date = date('Y-m-d', strtotime($children->date_of_birth . ' + ' . $immunization->recommended_days . ' days'));
                ChildrenImmunization::create([
                    'children_id' => $children->id,
                    'immunization_id' => $immunization->id,
                    'recommended_date' => $recommended_date,
                    'status' => 'belum',
                    'date_of_immunization' => null,
                    'note' => null
                ]);
            }

            // TODO:
            // 1. Change Return Route

            return response()->json([
                "message" => "Children created successfully",
                "data" => $children
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $child = Children::with(['photo'])->findOrFail($id);
        $measurement = Measurement::where('children_id', $id)->orderBy('created_at', 'desc')->first();
        $immunizations = ChildrenImmunization::with('immunization')->where('children_id', $id)->where('status', 'belum')->orderBy('recommended_date', 'asc')->take(3)->get();

        return Inertia::render('Dashboard/Children/Show', [
            'child' => $child,
            'measurement' => $measurement,
            'immunizations' => $immunizations
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $child = Children::with('photo')->findOrFail($id);
        return Inertia::render('Dashboard/Children/Edit', [
            'child' => $child
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $validated = $request->validate([
            "name" => ["required", "string", "max:255"],
            "date_of_birth" => ["required", "date", "before:today"],
            "gender" => ["required", "in:laki-laki,perempuan"],
            "is_alergic" => ["required", "boolean"],
            "alergic_desc" => ["nullable", "string", "max:255"],
            "photo" => ["nullable", "image", "max:2048"],
            "blood_type" => ["nullable", "in:A-,B-,AB-,O-,A+,B+,AB+,O+"],
        ]);


        return DB::transaction(function () use ($validated, $id) {
            $children = Children::with('photo')->findOrFail($id);

            if ($validated['photo'] != null ) {
                if($children->photo_id == null){
                    $image = DocumentFile::createFile('public','/children',$validated["photo"]);
                    $children->update([
                        'photo_id' => $image->id
                    ]);
                }else{
                    $image = DocumentFile::findOrFail($children->photo_id);
                    $image->replaceFile($validated["photo"]);
                }
            }

            if ($children->date_of_birth != $validated['date_of_birth']) {
                $childrenImmunizations = ChildrenImmunization::where('children_id', $children->id)->get();
                foreach ($childrenImmunizations as $childrenImmunization) {
                    $immunization = Immunization::findOrFail($childrenImmunization->immunization_id);
                    $recommended_date = date('Y-m-d', strtotime($validated['date_of_birth'] . ' + ' . $immunization->recommended_days . ' days'));
                    $childrenImmunization->update([
                        'recommended_date' => $recommended_date
                    ]);
                }
                Measurement::where('children_id', $children->id)->where('is_birth_measurement', true)->update([
                    'date_of_measurement' => $validated['date_of_birth']
                ]);
            }

            $children->update([
                'name' => $validated['name'],
                'date_of_birth' => $validated['date_of_birth'],
                'gender' => $validated['gender'],
                'is_alergic' => $validated['is_alergic'],
                'alergic_desc' => $validated['alergic_desc'],
                'blood_type' => $validated['blood_type'],
            ]);

            return redirect()->route('data-anak.show', $children->id);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $children = Children::findOrFail($id);
        $children->photo->deleteFile();
        $children->delete();
        return redirect()->route('data-anak.index');
    }
}
