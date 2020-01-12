#version 330

layout(location = 0) in vec2 v;
layout(location = 1) in vec4 data;

uniform float time;
uniform float mainSpeed;
uniform float minorsWidth = 1.0;

#define notesCount 52.0

out INTERFACE {
	float isMinor;
	vec2 uv;
	vec2 noteSize;
} Out;


void main(){
	float noteId = data[0];
	float start = data[1];
	float duration = data[2];
	float isMinor = data[3];

	float noteWidth = 0.95 * 2.0;
	float scalingFactor = isMinor != 0.0 ? minorsWidth : 1.0;

	float width = noteWidth / notesCount * scalingFactor;
	float height = duration * mainSpeed;

	Out.noteSize = vec2(width, height);
	
	// Compute note shift.
	// Horizontal shift based on note id, width of keyboard, and if the note is minor or not.
	// Vertical shift based on note start time, current time, speed, and height of the note quad.

	const float a = (1.0/(notesCount-1.0)) * (2.0 - 2.0/notesCount);
	const float b = -1.0 + 1.0/notesCount;
	vec2 noteShift = vec2(noteId * a + b + isMinor/notesCount, Out.noteSize.y * 0.5 - 0.5 + mainSpeed * (start - time));
	
	// Scale uv.
	Out.uv = Out.noteSize * v;
	Out.isMinor = isMinor;

	// Output position.
	gl_Position = vec4(Out.noteSize * v + noteShift, 0.0 , 1.0) ;
	
}
